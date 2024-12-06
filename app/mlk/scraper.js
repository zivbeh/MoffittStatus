import puppeteer from 'puppeteer';

const URL = 'https://live.waitz.io/fphvsk3elnhs';

async function scrapeOccupancy() {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(URL, { waitUntil: 'networkidle0' });
        await new Promise(resolve => setTimeout(resolve, 2000));

        const venues = await page.evaluate(() => {
            const cards = document.querySelectorAll('.MuiCard-root');
            return Array.from(cards).map(card => {
                const name = card.querySelector('.MuiTypography-h2') ? .textContent.trim();
                const status = card.querySelector('.MuiTypography-body1') ? .textContent.trim();
                const busyness = card.querySelector('.css-1tglk97') ? .textContent.trim();
                return { name, status, busyness };
            });
        });

        // Print results
        venues.forEach(venue => {
            if (venue.name && venue.busyness) {
                console.log(`${venue.name}: ${venue.busyness}`);
            }
        });

        await browser.close();
        return venues;
    } catch (error) {
        console.error('Error:', error.message);
        return [];
    }
}

export default scrapeOccupancy;