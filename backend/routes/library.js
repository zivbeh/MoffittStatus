const express = require('express');
const router = express.Router();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// POST /api/library/update
// Expected Body: { library: "Moffitt", rating: 5, isLoud: true, goodForGroups: true, floor: "4th" }
router.post('/update', async (req, res) => {
  const { library, rating, isLoud, goodForGroups, floor, longitude, latitude } = req.body;

  // Basic validation
  if (!library || rating === undefined) {
    return res.status(400).json({ error: 'Library name and rating are required' });
  }

  try {
    // mapped 'library' from body to 'libraryName' in database
    const newRating = await prisma.rating.create({
      data: {
        libraryName: library,
        rating: parseInt(rating),
        isLoud: Boolean(isLoud),
        goodForGroups: Boolean(goodForGroups),
        floor: String(floor),
        longitude: longitude || -1,
        latitude: latitude || -1,
      },
    });
    console.log("Did the thing")
    res.json({ message: 'Rating added successfully', data: newRating });
  } catch (error) {
    console.error('Error adding rating:', error);
    res.status(500).json({ error: 'Failed to add rating' });
  }
});

// GET /api/library/:libraryName
// Example: GET /api/library/Moffitt
router.get('/:libraryName', async (req, res) => {
  const { libraryName } = req.params;

  // The "Independent Value" (Baseline/Prior): A neutral starting point
  const INDEPENDENT_VALUE = 50; 
  // The "Controllable Constant" (Weight): Equivalent to having X number of phantom ratings
  const WEIGHT_CONSTANT = 5; 

  try {
    // Calculate timestamp for 3 hours ago
    const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);

    // Find all ratings for this specific library created in the last 3 hours
    const ratings = await prisma.rating.findMany({
      where: {
        libraryName: libraryName,
        createdAt: {
          gte: threeHoursAgo, // Greater than or equal to 3 hours ago
        },
      },
      orderBy: {
        createdAt: 'desc', // Show newest ratings first
      },
    });

    // 1. Calculate the sum of the actual ratings found
    const sumOfActualRatings = ratings.reduce((acc, curr) => acc + curr.rating, 0);
    const countOfActualRatings = ratings.length;

    // 2. Calculate Weighted Average
    // Formula: ( (Baseline * Weight) + SumOfActual ) / ( Weight + CountOfActual )
    // If 0 ratings exist, the result is exactly INDEPENDENT_VALUE.
    const weightedAverage = (
      (INDEPENDENT_VALUE * WEIGHT_CONSTANT) + sumOfActualRatings
    ) / (WEIGHT_CONSTANT + countOfActualRatings);

    res.json({
      library: libraryName,
      count: countOfActualRatings,
      average: weightedAverage.toFixed(1), // e.g., "3.2"
      config: {
        baseline: INDEPENDENT_VALUE,
        weight: WEIGHT_CONSTANT
      },
      reviews: ratings,
    });
  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({ error: 'Failed to fetch ratings' });
  }
});

router.get('/', async (req, res) => {
  const INDEPENDENT_VALUE = 50;
  const WEIGHT_CONSTANT = 5;

  try {
    const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);

    // 1. Let the DB do the math. 
    // This returns an array of objects containing only the stats per library.
    const groupedRatings = await prisma.rating.groupBy({
      by: ['libraryName'], // Group results by library
      where: {
        createdAt: {
          gte: threeHoursAgo,
        },
      },
      _sum: {
        rating: true, // Calculate Sum
      },
      _count: {
        rating: true, // Calculate Count
      },
    });

    // 2. Process the results in JavaScript
    // We map over the lightweight results to apply your custom weighted formula
    const results = groupedRatings.map((group) => {
      const sumOfActualRatings = group._sum.rating || 0;
      const countOfActualRatings = group._count.rating || 0;

      const weightedAverage = (
        (INDEPENDENT_VALUE * WEIGHT_CONSTANT) + sumOfActualRatings
      ) / (WEIGHT_CONSTANT + countOfActualRatings);

      return {
        library: group.libraryName,
        count: countOfActualRatings,
        average: weightedAverage.toFixed(1),
        // Note: We generally do NOT return raw reviews in a bulk summary 
        // list because the payload would be massive.
      };
    });

    res.json({
      meta: {
        baseline: INDEPENDENT_VALUE,
        weight: WEIGHT_CONSTANT,
        period: '3h'
      },
      data: results
    });

  } catch (error) {
    console.error('Error fetching aggregations:', error);
    res.status(500).json({ error: 'Failed to fetch library stats' });
  }
});
module.exports = router;