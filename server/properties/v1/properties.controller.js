const {createProperty} = require('./create.property.action.js');
const {readProperty} = require('./read.property.action.js');
const {updateProperty} = require('./update.property.action.js');
const {deleteProperty} = require('./delete.property.action.js');

const createPropertyController = async (req, res) => {
    try {
        if (!req.body) {
            res.status(400).json({ error: 'No property data provided' });
            return;
        }

        const properties = await createProperty(req.body, req.userId);
        res.status(201);
        res.json(properties);
    } catch (error) {
        console.error(`Error Creating properties: ${error.message}`);
        res.status(500).json({ error: error.message });
    } 
}

const readPropertyController = async (req, res) => {
    try {
        const id = req.params.id;
        const targetCurrency = req.query.targetCurrency;
        if (!id) {
            res.status(400).json({ error: 'No property id provided' });
            return;
        }

        const properties = await readProperty(id, targetCurrency);
        res.status(200);
        res.json(properties);
    } catch (error) {
        console.error(`Error Reading properties: ${error.message}`);
        res.status(500).json({ error: error.message });
    } 
}

const updatePropertyController = async (req, res) => {
    try {
        const id = req.params.id;
        if (!req.body) {
            res.status(400).json({ error: 'No property data provided' });
            return;
        }

        const properties = await updateProperty(id ,req.body, req.userId);
        res.status(200);
        res.json(properties);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const deletePropertyController = async (req, res) => {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ error: 'No property id provided' });
        return;
      }
  
      await deleteProperty(id, req.userId);
      res.status(200);
      res.json(`Property ${id} deleted`);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
module.exports = {createPropertyController, readPropertyController, updatePropertyController, deletePropertyController};