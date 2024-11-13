const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors"); // Import cors
const Shipment = require("./model/shipmentModel.js");
require("dotenv").config();

const app = express();
const port = 5000;

// Enable CORS for all origins
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB", err));

app.use(bodyParser.json());

app.post("/submit-shipment", async (req, res) => {
  const {
    fromCountry,
    fromCity,
    fromPin,
    toCountry,
    toCity,
    toPin,
    weight,
    length,
    width,
    height,
    isImporting,
  } = req.body;

  try {
    // Create a new shipment document and save it to MongoDB
    const shipment = new Shipment({
      fromCountry,
      fromCity,
      fromPin,
      toCountry,
      toCity,
      toPin,
      weight,
      length,
      width,
      height,
      isImporting,
    });

    await shipment.save();

    // Basic weight-based calculation for the quote
    let amount = 0;

    // Shipping rates (example, adjust as needed)
    const baseRate = 100; // Rate per kg
    const ratePerKg = 2; // Add extra per kg
    const weightCost = weight * ratePerKg;

    amount = baseRate + weightCost;

    // Determine currency based on the isImporting flag
    const currency = isImporting
      ? getCurrency(toCountry)
      : getCurrency(fromCountry);

    // Return the quote with the estimated delivery date and calculated amount
    const quote = {
      estimatedDelivery: "Fri, November 15", // Placeholder date
      amount: amount.toFixed(2),
      currency,
    };

    res
      .status(200)
      .json({ message: "Shipment details saved successfully", quote });
  } catch (error) {
    console.error("Error processing shipment:", error); // Detailed logging
    res
      .status(500)
      .json({ error: "Error processing shipment", details: error.message }); // Send error details
  }
});

// Helper function to determine currency based on country
function getCurrency(country) {
  const currencies = {
    US: "USD",
    IN: "INR",
    CA: "CAD",
    GB: "GBP",
    AU: "AUD",
    DE: "EUR",
    FR: "EUR",
    JP: "JPY",
    CN: "CNY",
  };

  return currencies[country] || "USD"; // Default to USD if country is not in the list
}

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
