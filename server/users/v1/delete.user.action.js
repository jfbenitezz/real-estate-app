const User = require('./userModel');
const Rental = require('../../models/rentalModel');

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

module.exports = { deleteUser };
