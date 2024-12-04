import React, { useState, useEffect } from 'react';
import PropertyCard from '../components/PropertyCard';
import Pagination from '../components/pagination';
import Filters from '../components/Filters';
import Sidebar from '../components/Sidebar';
import { Link } from 'react-router-dom';
import { IconButton } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import api from '../api';

const Rent = () => {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get('/catalog', {
          params: {
            page: currentPage,
            pageSize,
            search,
            filter: JSON.stringify({ ...filters, purpose: 'For Rent' }),
          },
        });
        setProperties(response.data.catalog.data);
        setTotalPages(Math.ceil(response.data.catalog.metadata.totalCount / pageSize));
      } catch (error) {
        setError(error.response ? error.response.data.error : 'Error al obtener las propiedades');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, [currentPage, pageSize, search, filters]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to the first page on new filter
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to the first page on new search
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleItemsPerPageChange = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setCurrentPage(1); // Resetear a la primera página cuando se cambie el límite
  };

  return (
    <>
      <section className="relative h-full max-h-[640px] mb-8 xl:mb-15 bg-[#FFFFE0]  block rounded-lg shadow-lg overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:ml-8 xl:ml-[135px] flex flex-col items-center lg:items-start text-center lg:text-left justify-center flex-1 px-4 lg:px-0 py-8">
            <h1 className="text-4xl lg:text-[58px] font-semibold leading-none mb-6">
              <span className="text-indigo-700">Renta</span> la casa que se acomode a ti.
            </h1>
            <p className="max-w-[600px] mb-8 text-lg font-semibold text-gray-700 lg:text-[20px]">
              Encuentra la casa o apartamento perfecto para ti.
              Descubre opciones que se ajusten a tus necesidades y estilo de vida.
              Desde acogedores apartamentos hasta amplias casas familiares, nuestra selección ofrece una variedad de opciones para cada presupuesto. Comienza hoy mismo tu búsqueda y encuentra el hogar que realmente se acomode a ti.
            </p>
          </div>
          <div className="hidden flex-1 lg:flex justify-end items-end">
            <img src="Imagenes/rentapart.jpg" alt="casa alquiler" className="object-cover h-full w-full" />
          </div>
        </div>
      </section>

      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-indigo-700">Propiedades en Renta</h2>
          <div className="flex items-center">
            <form onSubmit={handleSearchSubmit} className="flex items-center">
              <input
                type="text"
                placeholder="Buscar propiedades..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-300 px-4 py-2 rounded-md"
              />
              <button type="submit" className="ml-2 px-4 py-2 bg-indigo-500 text-white rounded-md">Buscar</button>
            </form>
            <IconButton onClick={toggleSidebar} color="primary" className="ml-4">
              <FilterListIcon />
            </IconButton>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <label htmlFor="pageSize" className="mr-2">Propiedades por página:</label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={handleItemsPerPageChange}
            className="border border-gray-300 px-2 py-1 rounded-md"
          >
            <option value="5">5</option>
            <option value="8">8</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </div>

        <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar}>
          <Filters onFilterChange={handleFilterChange} />
        </Sidebar>
        {isLoading ? (
          <p className="text-center">Cargando propiedades...</p>
        ) : error ? (
          <p className="text-center text-red-500">Error: {error}</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {properties.map((property) => (
                <Link key={property._id} to={`/property/rent/${property._id}`}>
                  <PropertyCard property={property} />
                </Link>
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </>
  );
};

export default Rent;