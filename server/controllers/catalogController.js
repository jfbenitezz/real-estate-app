const Property = require('../models/propertyModel');
const { getFilterOptions } = require('../controllers/filterController');
const  getCatalog = async (req, res) => {
    let { page, pageSize, search, sortField, sortOrder, filter } = req.query;
  
    try {
      page = parseInt(page, 10) || 1;
      pageSize = parseInt(pageSize, 10) || 5;

      sortField = sortField || 'price.amount'; 
      sortOrder = sortOrder === 'desc' ? -1 : 1; 

      search = search || '';
      const textSearch = search ? { $text: { $search: search } } : {};

      filter = filter || '{}';
      const filterParams = JSON.parse(filter);

      const catalog = await Property.aggregate([
        { // Using `$match` to filter properties based on search query and other filter parameters
          $match: {
            ...filterParams,
            ...textSearch, // Include the text search query
          },
        }, 
          // Using `$facet` to run multiple aggregation pipelines within a single stage.
          // One pipeline for getting metadata and another for getting actual data paginated.
          {
            $facet: {
            metadata: [{ $count: 'totalCount' }],
            data: [
              { $sort: { [sortField]: sortOrder } },
              { $skip: (page - 1) * pageSize },
              { $limit: pageSize }],
          },
        },
      ]);

      const totalCount = catalog[0].metadata.length > 0 ? catalog[0].metadata[0].totalCount : 0;

      return res.status(200).json({
        success: true,
        catalog: {
          metadata: { totalCount, page, pageSize },
          data: catalog[0].data,
        },
      });
    } catch (error) {
      console.error(`Error getting properties: ${error.message}`);
      return res.status(500).json({ success: false,  error: error.message });
    }
  };
  
  module.exports = {
    getCatalog
  };

