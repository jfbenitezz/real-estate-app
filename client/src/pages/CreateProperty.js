import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropertyForm from './PropertyForm';
import api from '../api';

const CreateProperty = () => {
  const navigate = useNavigate();

  const handleSubmit = async (newProperty) => {
    try {
      await api.post('/properties', newProperty);
      navigate('/properties'); // Redirigir a la lista de propiedades después de crear una nueva propiedad
    } catch (error) {
      console.error('Error al crear la propiedad:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <PropertyForm onSubmit={handleSubmit} />
    </div>
  );
};

export default CreateProperty;
