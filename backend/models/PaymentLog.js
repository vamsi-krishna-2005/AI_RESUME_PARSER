const mongoose = require('mongoose');
const PaymentLogSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  txnHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('PaymentLog', PaymentLogSchema);
