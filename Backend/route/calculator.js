// Backend/route/calculator.js
const express = require('express');
const router = express.Router();
const multer = require('multer'); // Added missing import
const { analyzeImage } = require('./utils');
const validateImageData = require('../validateImageData'); // Fixed import

const upload = multer();

router.post(
  '/',
  upload.single('image'),
  validateImageData, // Now properly imported
  async (req, res) => {
    try {
      let imageBuffer;
      
      if (req.body.image) {
        imageBuffer = Buffer.from(req.body.image.split(',')[1], 'base64');
      } else if (req.file) {
        imageBuffer = req.file.buffer;
      } else {
        return res.status(400).json({
          message: 'No image provided',
          status: 'error'
        });
      }

      const dictOfVars = req.body.dictOfVars || {};
      const responses = await analyzeImage(imageBuffer, dictOfVars);
      
      res.json({
        message: 'Image processed',
        data: responses,
        status: 'success'
      });

    } catch (error) {
      console.error('Route error:', error);
      res.status(500).json({
        message: error.message || 'Processing failed',
        status: 'error'
      });
    }
  }
);

module.exports = router;