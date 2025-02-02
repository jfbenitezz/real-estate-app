const User = require('./user.model');

const readUser = async (id) => {
    try {
      const targetUser = await User.findById(id).select('-password -isAdmin -refreshToken');
      if (!targetUser) {
        throw new Error("User not found");
      }
      console.log('User found:', targetUser);
      return targetUser;
  
    } catch (error) {
      console.error(`Error reading user: ${error.message}`);
      throw error;
    }
  }


module.exports = {readUser};