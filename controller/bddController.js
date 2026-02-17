import { google } from "googleapis";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
dotenv.config();

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];

let lastSentIndex = 0;

// Debug environment variables
console.log("Environment variables check:");
console.log(
  "GOOGLE_SERVICE_ACCOUNT_KEY exists:",
  !!process.env.GOOGLE_SERVICE_ACCOUNT_KEY
);
console.log(
  "GOOGLE_SERVICE_ACCOUNT_KEY length:",
  process.env.GOOGLE_SERVICE_ACCOUNT_KEY?.length || 0
);

// Service Account setup
let auth;
try {
  let credentials;

  // Try environment variable first
  if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    console.log("Using service account from environment variable");
    credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
  } else {
    // Fallback to key file
    console.log("Using service account from key.json file");
    const keyPath = path.join(process.cwd(), "key.json");
    credentials = JSON.parse(fs.readFileSync(keyPath, "utf8"));
  }

  auth = new google.auth.GoogleAuth({
    credentials: credentials,
    scopes: SCOPES,
  });

  console.log("Google Auth initialized successfully");
  console.log("Service account email:", credentials.client_email);
} catch (error) {
  console.error("Error loading service account key:", error.message);
  process.exit(1);
}

const sheets = google.sheets({ version: "v4", auth });

// Spreadsheet details
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const range = "Form responses 1!H:H";

console.log("Spreadsheet ID:", SPREADSHEET_ID);
console.log("Range:", range);

// Categoriesg
let categoryCounts = {
  AIDS: 0,
  AIML: 0,
  COMPS: 0,
  CSEDS: 0,
  EXTC: 0,
  ICB: 0,
  IT: 0,
  MECH: 0,
  Outsider: 0,
};

// Function to fetch and count (always fresh from sheet)
export async function fetchCategoryCounts() {
  try {
    console.log("Attempting to fetch data from Google Sheets...");

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: range,
    });

    console.log("Successfully fetched data from Google Sheets");
    const rows = response.data.values || [];
    console.log(`Found ${rows.length} rows`);

    // Reset counts
    for (let key in categoryCounts) {
      categoryCounts[key] = 0;
    }

    // Skip header row, flatten and clean values
    rows
      .slice(1)
      .flat()
      .forEach((value) => {
        const cleanValue = value ? value.toString().trim() : "";
        if (!cleanValue) return;

        if (cleanValue in categoryCounts) {
          categoryCounts[cleanValue]++;
        }
      });

    console.log("Category counts:", categoryCounts);
    return categoryCounts;
  } catch (err) {
    console.error("Error fetching data:", err.message);
    console.error("Full error:", err);
    throw err;
  }
}

export async function getLatestDonors() {
  try {
    console.log("Attempting to fetch data for latest donors...");

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "Form responses 1!A:Z",
    });
    console.log("Successfully fetched data for latest donors");

    const rows = response.data.values || [];
    const headers = rows.shift();
    console.log("Headers found:", headers);
    console.log(rows.length, "data rows found");
    console.log(rows.slice(0, 5)); // Log first 5 rows for debugging

    const nameIdx = headers.indexOf("Full Name");
    const statusIdx = headers.indexOf("Donated");
    const timeIdx = headers.indexOf("Timestamp");
    const bloodGroupIdx = headers.indexOf("Blood Group");
    const departmentIdx = headers.indexOf("Department");

    console.log(rows[0][timeIdx])
    console.log(new Date(rows[0][timeIdx]))

    const parseDate = (dateStr) => {

      if (!dateStr) return 0;

      const [datePart, timePart] = dateStr.split(" ");

      if (!datePart || !timePart) return 0;

      const [day, month, year] = datePart.split("/");

      // MANUALLY BUILD DATE
      return new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
        ...timePart.split(":").map(Number)
      ).getTime();
    };



    const donors = rows
      .filter(r => r[statusIdx] === "Donated")
      .sort((a, b) => parseDate(a[timeIdx]) - parseDate(b[timeIdx])
      )
      .map(r => ({
        name: r[nameIdx],
        bloodGroup: r[bloodGroupIdx],
        department: r[departmentIdx]
      }));

    let latest_donors = [];
    console.log("Latest 10 donors:", donors.slice(0, 10));
    console.log("Last sent index:", lastSentIndex);
    console.log("Total donors:", donors.length);
    if (donors.length >= lastSentIndex + 5) {
      latest_donors = donors.slice(lastSentIndex, lastSentIndex + 5);
      lastSentIndex += 5;
    } else {
      if (lastSentIndex !== 0) {
        latest_donors = donors.slice(lastSentIndex - 5, lastSentIndex);
      } else {
        latest_donors = [];
      }
    }

    return latest_donors;

  } catch (err) {
    console.error("Error fetching latest donors:", err.message);
    console.error("Full error:", err);
    throw err;
  }
}

export async function setIndexto(x=0) {
  lastSentIndex = x;
  console.log("Index reset to ",x);
}