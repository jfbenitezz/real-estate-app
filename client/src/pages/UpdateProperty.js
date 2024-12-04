import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PropertyForm from './PropertyForm';
import api from '../api';

const UpdateProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await api.get(`/properties/${id}`);
        setProperty(response.data);
      } catch (error) {
        setError(error.response?.data.error || 'Error al obtener la propiedad');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleSubmit = async (updatedProperty) => {
    try {
      await api.put(`/properties/${id}`, updatedProperty);
      navigate(`/property/buy/${id}`); // Redirigir a los detalles de la propiedad después de actualizar
    } catch (error) {
      console.error('Error al actualizar la propiedad:', error);
    }
  };

  if (isLoading) {
    return <p>Cargando propiedad...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <PropertyForm onSubmit={handleSubmit} property={property} />
    </div>
  );
};

export default UpdateProperty;
