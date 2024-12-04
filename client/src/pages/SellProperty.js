import React, { useState } from 'react';
import axios from 'axios';

const SellProperty = () => {
    const [propertyDetails, setPropertyDetails] = useState({
        description: '',
        bedrooms: '',
        bathrooms: '',
        streetType1: '',
        streetName1: '',
        streetType2: '',
        streetName2: '',
        unitNumber: '',
        city: '',
        state: '',
        images: []
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPropertyDetails({ ...propertyDetails, [name]: value });
    };

    const handleImageChange = (e) => {
        setPropertyDetails({ ...propertyDetails, images: [...e.target.files] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (const key in propertyDetails) {
            if (key === 'images') {
                propertyDetails.images.forEach((image) => {
                    formData.append('images', image);
                });
            } else {
                formData.append(key, propertyDetails[key]);
            }
        }

        try {
            await axios.post('http://localhost:3000/properties', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Property added successfully');
        } catch (error) {
            console.error('Error adding property', error);
            alert('Failed to add property');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-3xl font-bold mb-4">Vender Propiedad</h2>
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded p-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">Descripción</label>
                    <textarea
                        name="description"
                        id="description"
                        value={propertyDetails.description}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bedrooms">Habitaciones</label>
                    <input
                        type="number"
                        name="bedrooms"
                        id="bedrooms"
                        value={propertyDetails.bedrooms}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bathrooms">Baños</label>
                    <input
                        type="number"
                        name="bathrooms"
                        id="bathrooms"
                        value={propertyDetails.bathrooms}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                {/* Agrega aquí más campos según el modelo de propiedades */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="streetType1">Tipo de Calle 1</label>
                    <input
                        type="text"
                        name="streetType1"
                        id="streetType1"
                        value={propertyDetails.streetType1}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="streetName1">Nombre de Calle 1</label>
                    <input
                        type="text"
                        name="streetName1"
                        id="streetName1"
                        value={propertyDetails.streetName1}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="streetType2">Tipo de Calle 2</label>
                    <input
                        type="text"
                        name="streetType2"
                        id="streetType2"
                        value={propertyDetails.streetType2}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="streetName2">Nombre de Calle 2</label>
                    <input
                        type="text"
                        name="streetName2"
                        id="streetName2"
                        value={propertyDetails.streetName2}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="unitNumber">Número de Unidad</label>
                    <input
                        type="text"
                        name="unitNumber"
                        id="unitNumber"
                        value={propertyDetails.unitNumber}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">Ciudad</label>
                    <input
                        type="text"
                        name="city"
                        id="city"
                        value={propertyDetails.city}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="state">Estado</label>
                    <input
                        type="text"
                        name="state"
                        id="state"
                        value={propertyDetails.state}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="images">Imágenes</label>
                    <input
                        type="file"
                        name="images"
                        id="images"
                        onChange={handleImageChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        multiple
                        required
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Publicar Propiedad
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SellProperty;
