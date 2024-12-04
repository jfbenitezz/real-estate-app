import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import BathroomIcon from '@mui/icons-material/Bathroom';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import api from '../api';
import '../index.css';

const PropertyDetailsBuy = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get(`/properties/${id}`);
        setProperty(response.data);
        if (response.data.profilePictures.length > 0) {
          await fetchImages(response.data.profilePictures);
        }
      } catch (error) {
        setError(error.response?.data.error || 'Error al obtener la propiedad');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchImages = async (imageIds) => {
      try {
        const response = await api.get(`/images`, {
          params: { ids: imageIds.join(',') }
        });
        setImages(response.data);
      } catch (error) {
        console.error('Error fetching images:', error);
        setError('Error fetching images');
      }
    };

    fetchProperty();
  }, [id]);

  if (isLoading) {
    return <p>Cargando propiedad...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!property) {
    return <p>Propiedad no encontrada</p>;
  }

  const priceAmount = property.price.amount.$numberDecimal
    ? parseFloat(property.price.amount.$numberDecimal)
    : parseFloat(property.price.amount.toString());

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-4">{property.address.fullAddress}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {images.map((image, index) => (
          <div key={index}>
            <img
              src={image.url}
              alt={property.address.fullAddress}
              className="w-full h-96 object-cover"
            />
          </div>
        ))}
      </div>
      <div className="mt-4">
        <p className="text-gray-700">{property.description}</p>
        <div className="mt-4 flex items-center">
          <div className="flex items-center mr-4">
            <HomeIcon className="w-5 h-5 text-gray-500" />
            <span className="ml-1 text-gray-700">{property.bedrooms} habitaciones</span>
          </div>
          <div className="flex items-center mr-4">
            <BathroomIcon className="w-5 h-5 text-gray-500" />
            <span className="ml-1 text-gray-700">{property.bathrooms} baños</span>
          </div>
          {property.parking && (
            <div className="flex items-center">
              <LocalParkingIcon className="w-5 h-5 text-gray-500" />
              <span className="ml-1 text-gray-700">Parking disponible</span>
            </div>
          )}
        </div>
        <p className="mt-4 text-2xl font-bold text-gray-900">
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: property.price.currency,
          }).format(priceAmount)}
        </p>
        <div className="mt-4 flex">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
            Hacer una oferta
          </button>
          <Link to={`/finance?propertyId=${property._id}`} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Financiar Propiedad
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsBuy;
