const User = require('./userModel');

const readUser = async (req, res) => {
    try {
      const { id } = req.params;
      const targetUser = await User.findById(id).select('-password -isAdmin -refreshToken');
      if (!targetUser) {
        return res.status(404).json({ error: "User not found" });
      }
      console.log('User found:', targetUser);
      res.status(200).json(targetUser);
  
    } catch (error) {
      console.error(`Error reading user: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  }

module.exports = {readUser};