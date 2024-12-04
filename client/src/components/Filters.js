import React, { useState, useEffect } from 'react';
import api from '../api';

const Filters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const fields = ['type', 'address.city']; // Removed 'purpose'
        const filterPromises = fields.map((field) => api.get(`/filter/${field}`));

        const filterResponses = await Promise.all(filterPromises);
        const filtersData = filterResponses.map((response, index) => ({
          field: fields[index],
          label: fields[index].charAt(0).toUpperCase() + fields[index].slice(1),
          options: response.data.filterOptions[fields[index]],
        }));

        setFilters(filtersData);
      } catch (error) {
        console.error('Error fetching filters:', error);
      }
    };

    fetchFilters();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setSelectedFilters((prev) => ({ ...prev, [name]: value }));
    onFilterChange({ ...selectedFilters, [name]: value });
  };

  return (
    <div className="mb-4">
      {filters.map((filter) => (
        <div key={filter.field} className="mb-2">
          <label className="block text-sm font-medium text-gray-700">{filter.label}</label>
          <select
            name={filter.field}
            value={selectedFilters[filter.field] || ''}
            onChange={handleFilterChange}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Todos</option>
            {filter.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};

export default Filters;