const Image = require('./imageModel');

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
  
module.exports = { updateText };