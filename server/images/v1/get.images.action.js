

const Image = require('./imageModel');

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

  module.exports = {getImages}