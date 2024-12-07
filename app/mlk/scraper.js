const axios = require('axios');
const cheerio = require('cheerio');

const URL = 'https://live.waitz.io/fphvsk3elnhs';

function scrapeOccupancy() {
    return new Promise(async(resolve, reject) => {
        try {
            console.log('Fetching HTML...');
            const { data: html } = await axios.get(URL);

            console.log('Parsing HTML...');
            const $ = cheerio.load(html);

            const venues = [];
            $('.MuiCard-root').each((_, element) => {
                const name = $(element).find('.MuiTypography-h2').text().trim();
                const status = $(element).find('.MuiTypography-body1').text().trim();
                const busyness = $(element).find('.css-1tglk97').text().trim();

                if (name && busyness) {
                    venues.push({ name, status, busyness });
                }
            });

            console.log('Scraping complete.');
            resolve(venues);
        } catch (error) {
            console.error('Error scraping occupancy:', error.message);
            reject(error);
        }
    });
}

// Test function using promises
function testScraper() {
    console.log('Starting scrapeOccupancy test...');
    scrapeOccupancy()
        .then((results) => {
            console.log('Scraped Venues:', results);
        })
        .catch((error) => {
            console.error('Test failed with error:', error.message);
        })
        .finally(() => {
            console.log('Test completed.');
        });
}

// Execute test function if the file is run directly
if (require.main === module) {
    testScraper();
}

module.exports = scrapeOccupancy;