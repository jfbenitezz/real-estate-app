const User = require('./user.model');
const {validateUser} = require('../../middleware/validator');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { VALID_ROLES } = require('./user.constants');

const createUser = async (userData) => {
    const { error } = validateUser(userData);
    if (error) {
      throw new Error(error.details[0].message);
    }
    
    if (userData.role && !VALID_ROLES.includes(userData.role)) {
      throw new Error('Invalid role provided.');
  }
    userData.role = userData.role || "client";  
    
    try {
      const newUser = new User(userData);
      const hash = await bcrypt.hash(newUser.password, saltRounds);
  
      // Assign the hashed password to the user object
      newUser.password = hash;
      await newUser.save();
      return newUser;
    } catch (error) {
      throw new Error(`Error saving new property: ${error.message}`);
    }
  };

  module.exports = {createUser};