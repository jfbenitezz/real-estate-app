const { v4: uuidv4 } = require('uuid');
const path = require('node:path');
const sharp = require('sharp');

const Image = require('./image.model');

const {s3} = require('../../config/bucket');
const {PutObjectCommand, DeleteObjectCommand} = require("@aws-sdk/client-s3");

const createImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded.' });
    }
    const savedImages = [];
    let counter = 0;
    for (const file of req.files) {
      //Create unique id
      counter++;
      const uniqueId = uuidv4();
      const extension = path.extname(file.originalname);
      const uniqueKey = `${uniqueId}${extension}`;

      //Resize image
      const Buffer = await sharp(file.buffer)
      .resize({ height: 800, width: 600, fit: "contain" }).toBuffer()

      //Create command for s3 bucket
      const Params = {
        Bucket: process.env.BUCKET_NAME,
        Key: uniqueKey,
        Body: Buffer,
        ContentType: file.mimetype
      }
      //Send command
      const command = new PutObjectCommand(Params);
      await s3.send(command);

      //Saver image reference to database
      const newImage = new Image({
        url: uniqueKey,
        altText: `${req.body.altText}${counter}`,
        user: req.body.user
      });

      await newImage.save();
      console.log('Image created:', newImage);
      savedImages.push(newImage);
    }
    res.status(201).json({
      message: 'Upload successful',
      images: savedImages
    });
  } catch (error) {
    console.error(`Error saving new image: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {createImages};