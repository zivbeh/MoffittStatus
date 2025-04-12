import axios from 'axios';
import * as cheerio from 'cheerio';

const URL = 'https://live.waitz.io/fphvsk3elnhs';

async function scrapeOccupancy() {
    try {
        const { data: html } = await axios.get(URL);
        const $ = cheerio.load(html); // Correct way to use cheerio

        const venues = [];
        $('.MuiCard-root').each((_, element) => {
            const name = $(element).find('.MuiTypography-h2').text().trim();
            const status = $(element).find('.MuiTypography-body1').text().trim();
            const busyness = $(element).find('.css-1tglk97').text().trim();

            if (name && busyness) {
                venues.push({ name, status, busyness });
            }
        });

        return venues;
    } catch (error) {
        console.error('Error:', error.message);
        return [];
    }
}

export default scrapeOccupancy;