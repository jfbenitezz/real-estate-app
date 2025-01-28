const {s3} = require('../../middleware/bucket');
const {DeleteObjectCommand} = require("@aws-sdk/client-s3");


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

  module.exports = { deleteImages, deleteImageFromS3 };