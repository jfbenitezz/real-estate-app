import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import PropertyCard from '../components/PropertyCard';

const UserPropertiesPage = ({ user }) => {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get(`/properties?owner=${user._id}`);
        setProperties(response.data);
      } catch (error) {
        setError(error.response?.data.error || 'Error al obtener las propiedades');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, [user._id]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/properties/${id}`);
      setProperties(properties.filter((property) => property._id !== id));
    } catch (error) {
      console.error('Error al eliminar la propiedad:', error);
    }
  };

  if (isLoading) {
    return <p>Cargando propiedades...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-4">Mis Propiedades</h2>
      <div className="flex justify-end mb-4">
        <Link to="/properties/new" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Nueva Propiedad
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {properties.map((property) => (
          <div key={property._id} className="relative">
            <PropertyCard property={property} />
            <div className="absolute top-0 right-0 mt-2 mr-2 flex space-x-2">
              <Link to={`/properties/${property._id}/edit`} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded">
                Editar
              </Link>
              <button
                onClick={() => handleDelete(property._id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserPropertiesPage;
