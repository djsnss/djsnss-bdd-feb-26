import express from "express";
import { fetchCategoryCounts,getLatestDonors,setIndexto } from "../controller/bddController.js";

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

router.get("/set-index/:idx", (req, res) => {
  const index = Number(req.params.idx);
  if (isNaN(index)) {
    return res.status(400).json({ error: "Index must be a number" });
  }
  if(index%5 !== 0){
    return res.status(400).json({ error: "Index must be a multiple of 5" });
  }
  setIndexto(index);
  res.json({ message: `Index set to ${index}` });
});

export default router;
