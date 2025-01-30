const User = require('./user.model');
const {validateUser} = require('../../middleware/validator');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const createUser = async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    
    if (req.body.isAdmin !== undefined) {
      return res.status(403).json({ error: 'Setting isAdmin is not allowed.' });
    }
    
    try {
      const newUser = new User(req.body);
      const hash = await bcrypt.hash(newUser.password, saltRounds);
  
      // Assign the hashed password to the user object
      newUser.password = hash;
      await newUser.save();
      console.log('User created:', newUser);
      res.status(201).json(newUser);
    } catch (error) {
      console.error(`Error saving new property: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  };

  module.exports = {createUser};