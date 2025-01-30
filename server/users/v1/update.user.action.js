const User = require('./user.model');

const updateUser = async (req, res) => {
  try {
    const { id } = req.params; 
    const updateFields = req.body;

    let user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user._id.toString() !== req.userId) {
      return res.status(403).json({ error: "Access denied. You are not authorized to update this user." });
    }

    // Update specific fields
    for (let field in updateFields) {
      if (updateFields.hasOwnProperty(field)) {
        user[field] = updateFields[field];
      }
    }
    // Save the updated user
    user = await user.save();

    console.log('User updated:', user);
    res.status(200).json(user);
  } catch (error) {
    console.error(`Error updating user: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {updateUser};