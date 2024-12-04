// src/components/FinanceForm.js
import React, { useState } from 'react';

const FinanceForm = () => {
  const [amount, setAmount] = useState('');
  const [property, setProperty] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Aquí puedes implementar la lógica para enviar la solicitud de financiamiento
    console.log('Solicitud de financiamiento:', { amount, property });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4">
      <h2 className="text-2xl font-bold text-center mb-4">Financiar Propiedad</h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
          Cantidad
        </label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="property">
          Propiedad
        </label>
        <input
          type="text"
          id="property"
          value={property}
          onChange={(e) => setProperty(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Solicitar Financiamiento
        </button>
      </div>
    </form>
  );
};

export default FinanceForm;