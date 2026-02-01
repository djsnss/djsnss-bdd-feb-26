import express from "express";
import { fetchCategoryCounts,getLatestDonors } from "../controller/bddController.js";

const router = express.Router();

// Simple endpoint to get category counts
router.get("/counts", async (req, res) => {
  try {
    const counts = await fetchCategoryCounts();
    res.json(counts);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch data",
      details: error.message,
    });
  }
});

router.get("/latest-donors", async (req, res) => {
  try {
    const donors = await getLatestDonors();
    res.json(donors);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch latest donors",
      details: error.message,
    });
  }
});

export default router;
