const express = require('express');
const router = express.Router();
const PaymentLogSchema = require('../models/PaymentLog');

router.post('/log-payment', async(req, res)=> {
    const {userId, txnHash} = req.body;
    await PaymentLogSchema.create({userId, txnHash});
    res.json({msg: 'Payment logged '});
});

module.exports = router;