const Property = require('../properties/v1/propertyModel');
const getFilterOptions = async (req, res) => {
    const { field } = req.params;
    if (!field || typeof field !== 'string' || field.trim() === '') {
        return res.status(400).json({ success: false, error: "Field parameter is required and must be a non-empty string" });
    }
    
    try{
        const filterOptions = await Property.aggregate([
            {
                $group: {
                    _id: null,
                    options: { $addToSet: `$${field}` }
                }
            },
            {
                $project: {
                    _id: 0,
                    options: 1
                }
            }
        ]);

        if (filterOptions[0].options.length === 0) {
            return res.status(404).json({ success: false, error: "Field not found" });
        }

        const options = filterOptions.length > 0 ? filterOptions[0].options : [];
        return res.status(200).json({
            success: true,
            filterOptions: {
                [field]: options
            }
        });
    } catch (error) {
        console.error(`Error getting filter options for ${field}: ${error.message}`);
        return res.status(500).json({ success: false, error: `Error retrieving filter options for ${field}: ${error.message}` });
    }
}  

module.exports = {
    getFilterOptions
};
