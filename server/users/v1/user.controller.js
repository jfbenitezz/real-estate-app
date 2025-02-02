const {createUser} = require('./create.user.action.js');
const {readUser} = require('./read.user.action.js');
const {updateUser} = require('./update.user.action.js');
const {deleteUser} = require('./delete.user.action.js');

const createUserController = async (req, res) => {
    try {
        const user = await createUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        console.error(`Error creating user: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

const readUserController = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await readUser(id);
        res.status(200).json(user);
    } catch (error) {
        console.error(`Error reading user: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

const updateUserController = async (req, res) => {
    try {
        const id = req.params.id;
        const updateFields = req.body;
        const user = await updateUser(id, updateFields, req.userId);
        res.status(200).json(user);
    } catch (error) {
        console.error(`Error updating user: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

const deleteUserController = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await deleteUser(id, req.userId);
        res.status(200).json(user);
    } catch (error) {
        console.error(`Error deleting user: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createUserController, readUserController, updateUserController, deleteUserController };