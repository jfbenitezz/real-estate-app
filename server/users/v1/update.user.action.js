const User = require('./user.model');

const updateUser = async (id, updateFields, userId) => {
  try {
    let user = await User.findById(id);

    if (!user) {
      throw new Error("User not found");
    }

    if (user._id.toString() !== userId) {
      throw new Error("Access denied. You are not authorized to update this user.");
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
    return user;
  } catch (error) {
    console.error(`Error updating user: ${error.message}`);
    throw error;
  }
};

module.exports = {updateUser};