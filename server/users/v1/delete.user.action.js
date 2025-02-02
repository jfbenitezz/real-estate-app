const User = require('./user.model');
const Rental = require('../../rentals/v1/rental.model');

const deleteUser = async (id, userId, role) => {
  try {
    let user = await User.findById(id);
    if (!user) {
      throw new Error("User not found");
    }

    if (user._id.toString() !== userId && role !== 'admin') {
      throw new Error("Access denied. You are not authorized to delete this user.");
    }

    // Find rentals associated with the user
    const rentals = await Rental.find({ user: id });

    // Check if any rental has an 'Active' status
    const hasActiveRentals = rentals.some(rental => rental.status === 'Active');
    if (hasActiveRentals) {
      throw new Error("Cannot delete user with active rentals");
    }

    // Delete the user
    const deletedUser = await User.findByIdAndDelete(id);
    console.log('User deleted:', deletedUser);
    return { status: 200, data: deletedUser };
  } catch (error) {
    console.error(`Error deleting user: ${error.message}`);
    throw new Error(error.message);
  }
};

module.exports = { deleteUser };
