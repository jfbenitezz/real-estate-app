const { v4: uuidv4 } = require('uuid');
const path = require('node:path');
const sharp = require('sharp');

const Image = require('../models/imageModel');

const {s3} = require('../middleware/bucket');
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

const getImages = async (req, res) => {
    try {
      let { ids } = req.query;
      ids = ids.split(",")

      const images = await Image.find({ _id: { $in: ids } });
  
      if (images.length === 0) {
        return res.status(404).json({ error: 'Images not found' });
      }
  
      const region = process.env.BUCKET_REGION
      const bucketName = process.env.BUCKET_NAME
      const imagesWithUrls = images.map(image => {
        const publicUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${image.url}`;
        return { ...image.toObject(), url: publicUrl };
      });
  
      res.status(200).json(imagesWithUrls);
    } catch (error) {
      console.error(`Error fetching images: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  };

  const deleteImages = async (req, res) => {
    try {
      let { ids } = req.query;
      ids = ids.split(",");
      if (ids.length === 0) {
        return res.status(400).json({ error: 'No image ids provided' });
      }
  

    // Fetch image URLs owned by the authenticated user
    const images = await Image.find({ _id: { $in: ids }});

    if (images.length === 0) {
      return res.status(404).json({ error: 'Images not found' });
    }

        // Check if the authenticated user is the owner of the images
    const userId = req.userId; // Get authenticated user's ID
    for (const image of images) {
      if (image.user.toString() !== userId) {
        return res.status(403).json({ error: "Access denied. You are not the owner of one or more images." });
      }
    }
    const imageUrls = images.map(image => image.url);

    // Delete images from S3
    for (const imageUrl of imageUrls) {
      await deleteImageFromS3(imageUrl);
    }

    // Delete images from the database
    try {
        await Image.deleteMany({ _id: { $in: ids }});
    } catch (error) {
        console.error(`Error deleting images from  database: ${error.message}`);
        res.status(500).json({ error: error.message });
        return;
    }

      res.status(200).json({ message: 'Images deleted successfully' });
    } catch (error) {
      console.error(`Error deleting images: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  };
  
  const deleteImageFromS3 = async (key) => {
    const deleteParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: key
    };
  
    try {
      await s3.send(new DeleteObjectCommand(deleteParams))
      console.log(`Successfully deleted ${key} from S3`);
    } catch (err) {
      console.error(`Error deleting ${key} from S3: ${err}`);
      throw err;
    }
  };

  const updateText = async (req, res) => {
    try {
      const { id } = req.params;
      const { altText } = req.body;

      const image = await Image.findById(id);
  
      if (!image) {
        return res.status(404).json({ error: 'Image not found' });
      }
  
      const userId = req.userId; // Get authenticated user's ID
      if (image.user.toString() !== userId) {
        return res.status(403).json({ error: "Access denied. You are not the owner of one or more images." });
      }
  
      const updatedImage = await Image.findByIdAndUpdate(
        id,
        { altText },
      );

      console.log('Image updated:', updatedImage);
      res.status(201).json(updatedImage);
    } catch (error) {
      console.error(`Error updating image: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  };
  
module.exports = { createImages, getImages, deleteImages, updateText };