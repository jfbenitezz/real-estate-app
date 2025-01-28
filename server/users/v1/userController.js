const User = require('./userModel');
const Rental = require('../../models/rentalModel');
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

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    let user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user._id.toString() !== req.userId) {
      return res.status(403).json({ error: "Access denied. You are not authorized to delete this user." });
    }

    // Find rentals associated with the user
    const rentals = await Rental.find({ user: id });

    // Check if any rental has an 'Active' status
    const hasActiveRentals = rentals.some(rental => rental.status === 'Active');
    if (hasActiveRentals) {
      return res.status(400).json({ error: "Cannot delete user with active rentals" });
    }

    // Delete the user
    const deletedUser = await User.findByIdAndDelete(id);
    console.log('User deleted:', deletedUser);
    res.status(200).json(deletedUser);
  } catch (error) {
    console.error(`Error deleting user: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createUser, readUser ,updateUser, deleteUser
};
