"use client";

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
    // Helper function to send updates
    const sendLibraryUpdate = async (libraryName, floor, busyScale) => {
        const currentTime = new Date().toISOString();
        const data = {
            libraryName,
            floor,
            busyScale: String(busyScale),
            updatedBy: "System",
            createdAt: currentTime,
        };

        try {
            await axios.post("/api/saveData", data, {
                baseURL: baseURL,
                headers: { "Content-Type": "application/json" },
            });
            console.log(`Updated ${libraryName}${floor ? ` - ${floor}` : ""} with scale ${busyScale}`);
        } catch (error) {
            console.error(`Failed to update ${libraryName}${floor ? ` - ${floor}` : ""}:`, error.message);
        }
    };

    // 7 AM - All libraries start with scale 1
    cron.schedule('0 7 * * 1-5', async () => {
        const libraries = ["Moffitt Library", "Doe Library", "Main Stacks", "Haas Library"];
        const moffittFloors = ["Floor 1", "Floor 3", "Floor 4", "Floor 5"];
        
        for (const library of libraries) {
            if (library === "Moffitt Library") {
                for (const floor of moffittFloors) {
                    await sendLibraryUpdate(library, floor, 1);
                }
            } else {
                await sendLibraryUpdate(library, null, 1);
            }
        }
    });

    // 9 AM updates
    cron.schedule('0 9 * * 1-5', async () => {
        await sendLibraryUpdate("Moffitt Library", "Floor 1", 2);
        await sendLibraryUpdate("Moffitt Library", "Floor 3", 2);
        await sendLibraryUpdate("Moffitt Library", "Floor 4", 3);
        await sendLibraryUpdate("Moffitt Library", "Floor 5", 3);
    });

    // 11 AM updates
    cron.schedule('0 11 * * 1-5', async () => {
        await sendLibraryUpdate("Moffitt Library", "Floor 4", 4);
    });

    // 12 PM updates
    cron.schedule('0 12 * * 1-5', async () => {
        await sendLibraryUpdate("Moffitt Library", "Floor 5", 4);
        await sendLibraryUpdate("Doe Library", null, 3);
        await sendLibraryUpdate("Main Stacks", null, 2);
    });

    // 2 PM updates
    cron.schedule('0 14 * * 1-5', async () => {
        await sendLibraryUpdate("Moffitt Library", "Floor 3", 4);
        await sendLibraryUpdate("Main Stacks", null, 3);
    });

    // 4 PM updates
    cron.schedule('0 16 * * 1-5', async () => {
        await sendLibraryUpdate("Moffitt Library", "Floor 5", 5);
    });

    // 6 PM updates
    cron.schedule('0 18 * * 1-5', async () => {
        await sendLibraryUpdate("Moffitt Library", "Floor 5", 4);
        await sendLibraryUpdate("Main Stacks", null, 2);
    });

    // 8 PM updates
    cron.schedule('0 20 * * 1-5', async () => {
        await sendLibraryUpdate("Moffitt Library", "Floor 5", 5);
        await sendLibraryUpdate("Main Stacks", null, 3);
    });

    // 10 PM updates
    cron.schedule('0 22 * * 1-5', async () => {
        await sendLibraryUpdate("Moffitt Library", "Floor 1", 2);
    });

    // 1 AM updates
    cron.schedule('0 1 * * 2-6', async () => {
        await sendLibraryUpdate("Moffitt Library", "Floor 4", 3);
        await sendLibraryUpdate("Moffitt Library", "Floor 5", 3);
    });

    console.log("Starting server");
    createServer((req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    }).listen(process.env.PORT || 3000, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${process.env.PORT || 3000}`);
    });
});