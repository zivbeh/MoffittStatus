import { spawn } from 'child_process';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as cheerio from 'cheerio';
import process from 'process';
const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const isWindows = process.platform === "win32";

const PYTHON_PATH = path.join(
  __dirname, 
  isWindows ? './venv/Scripts/python.exe' : './venv/bin/python'
);const SCRIPT_PATH = path.join(__dirname, './python/googleMapCapacityScraper.py');

export async function getAllLibraryHours() {
    try {
      const baseUrl = 'https://www.lib.berkeley.edu';
      const response = await fetch(`${baseUrl}/hours`);
      const html = await response.text();
      
      //const htmlText = await response.text();
      const libraries = [];
      const $ = cheerio.load(html);
      $('.library-hours-listing').each((_, element) => {
        const $el = $(element);
        
        // Node ID
        const nid = $el.attr('data-nid');
  
        // --- NEW: Image Extraction ---
        // 1. Find the image container relative to the main 'li' element
        const imageRelativeSrc = $el.find('.library-hours-listing-image img').attr('src');
        // 2. Prepend base URL if the src exists
        const imageSrc = imageRelativeSrc ? `${baseUrl}${imageRelativeSrc}` : undefined;
  
        // Scope searches to the info div for text details
        const $info = $el.find('.library-hours-listing-info');
  
        // Basic Info
        const $nameEl = $info.find('.library-name').clone();
        $nameEl.find('br').replaceWith('\n'); // Keep your newline fix
        const name = $nameEl.text().trim();
        
        const status = $info.find('.library-open-status').text().trim();
        let hours = $info.find('.library-hours').text().trim();
        
        const address = $info.find('.library-hours-listing-address').text()
          .replace(/\s\s+/g, ' ')
          .trim();
  
        const googleMapsLink = $info.find('a.google-maps-link').attr('href');
        const services = $info.find('.available-services .available .tooltip')
        .map((_, el) => $(el).text().trim())
        .get()
        .join(' ');
        // --- NEW: Study Space Extraction ---
        // 1. Find the container shown in your second screenshot
        const $studyLink = $el.find('.reserve-study-space-link a');
        // 2. Get the href if it exists
        const studySpaceLink = $studyLink.length > 0 ? $studyLink.attr('href') : undefined;
        // 3. Simple boolean to check existence
        const hasStudySpace = !!studySpaceLink; 
  
        // Formatting logic you requested previously
        if(hours.length < 3) hours = "";
        if(hours.includes('hoursStarts')) hours = hours.replace('hoursStarts', 'hours\nStarts');
        if(hours.includes(' Cal ID')) hours = hours.replace(' Cal ID', '\nCal ID');
  
        // console.log(status, ' | ', name)
        if (name) {
          libraries.push({
            name,
            status,
            hours,
            address,
            googleMapsLink,
            nid,
            services: services || undefined,
            imageSrc,       
            studySpaceLink,
            hasStudySpace
          });
        }
      });
      console.log("Got hours data")
      return libraries;
  
    } catch (error) {
      console.error('Error fetching library hours:', error);
      return null;
    }
  }

async function updateOneLibrary(library) {
  return new Promise((resolve) => {
    console.log(`[Updater] Scraping ${library.name}...`);
    
    const python = spawn(PYTHON_PATH, [SCRIPT_PATH, library.googleUrl]);
    let dataBuffer = '';

    python.stdout.on('data', (data) => {
      dataBuffer += data.toString();
    });

    python.on('close', async (code) => {
      try {
        const result = JSON.parse(dataBuffer);

        if (result.error) {
          console.error(`Error scraping ${library.name}:`, result.error);
          resolve(false);
          return;
        }

        // this is the live info
        await prisma.library.update({
          where: { id: library.id },
          data: {
            currentBusyness: result.percentage || 0,
            isOpen: result.is_open,
            lastUpdated: new Date(),
            weeklySchedule: result.schedule
          }
        });

        //this is to store in our logs to handle for the future
        if (result.is_open) {
          await prisma.trafficLog.create({
            data: {
              libraryId: library.id,
              busyness: result.percentage || 0
            }
          });
        }
        console.log(result)
        if (result && result.schedule.length > 0)
            console.log(result.schedule[0].data)
        console.log(`Updated ${library.name}: ${result.percentage}%`);
        resolve(true);

      } catch (e) {
        console.error("JSON Parse Error:", e.message);
        resolve(false);
      }
    });
  });
}

export async function runBatchUpdate() {
  console.log("STARTING BATCH UPDATE");
  const res = await getAllLibraryHours()
  if (res) {
    for (const libData of res) {
      if (!libData.name) continue;
      console.log(libData)
      await prisma.library.upsert({
        where: { name: libData.name },
        update: {
          googleUrl: libData.googleMapsLink || "", 
          address: libData.address || null,
          imageSrc: libData.imageSrc || null,
          studySpaceUrl: libData.studySpaceLink || null,
          services: libData.services || null,
        },
        create: {
          name: libData.name,
          googleUrl: libData.googleMapsLink || "",
          address: libData.address || null,
          imageSrc: libData.imageSrc || null,
          studySpaceUrl: libData.studySpaceLink || null,
          services: libData.services || null,
        }
      });
    }
    console.log(`Synced ${res.length} libraries.`);
  }

  console.log("Updating Live Traffic Data...");
  const libraries = await prisma.library.findMany({
    where: {
      googleUrl: { not: "" }
    }
  });

  for (const lib of libraries) {
    await updateOneLibrary(lib);
  }
  console.log("UPDATE FINISHED");
}

