const mongoose = require("mongoose");

const shipmentSchema = new mongoose.Schema({
  fromCountry: { type: String, required: true },
  fromCity: { type: String, required: false },
  fromPin: { type: String, required: true },
  toCountry: { type: String, required: true },
  toCity: { type: String, required: false },
  toPin: { type: String, required: true },
  weight: { type: Number, required: true },
  length: { type: Number, required: false },
  width: { type: Number, required: false },
  height: { type: Number, required: false },
  isImporting: { type: Boolean, required: true },
});

const Shipment = mongoose.model("Shipment", shipmentSchema);

module.exports = Shipment;
