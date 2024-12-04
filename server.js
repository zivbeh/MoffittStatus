const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const cron = require('node-cron');
const axios = require('axios');

const dev = process.env.NODE_ENV !== 'production';
const baseURL = dev ? 'http://localhost:3000' : 'https://moffittstatus.live';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
            cron.schedule('0 5 * * *', async() => {
                        console.log('Cron job started');
                        const libraries = [
                            { name: "Moffitt Library", floors: ["Floor 1", "Floor 3", "Floor 4", "Floor 5"] },
                            { name: "Doe Library", floors: [null] },
                            { name: "Haas Library", floors: [null] },
                            { name: "Main Stacks", floors: [null] },
                        ];
                        const currentTime = new Date().toISOString();
                        const emptyStatus = {
                            busyScale: "1", // "Wide Open" status
                            updatedBy: "System",
                            createdAt: currentTime,
                        };

                        for (const library of libraries) {
                            for (const floor of library.floors) {
                                try {
                                    const data = {...emptyStatus, libraryName: library.name, floor };

                                    console.log(`Updating ${library.name}${floor ? ` - ${floor}` : ""} with data:`, data);

                    const response = await axios.post("/api/saveData", data, {
                    baseURL: baseURL,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    });

                    console.log(`Successfully updated ${library.name}${floor ? ` - ${floor}` : ""}:`, response.data);
                } catch (error) {
                    console.error(`Failed to update ${library.name}${floor ? ` - ${floor}` : ""}:`, error.response?.data || error.message);
                }
            }
        }
        console.log("Cron job completed: All libraries and floors updated");
    });
    console.log("startingServer")

    createServer((req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    }).listen(process.env.PORT || 3000, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${process.env.PORT || 3000}`);
    });
});