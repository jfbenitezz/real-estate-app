import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css';

const Home = () => {
  return (
    <>
    <section className="h-full max-h-[640px] mb-8 xl:mb-4 bg-indigo-500">
      <img src="Imagenes/Encuentra tu hogar.png" alt="Imagen de fondo" className="w-full object-cover" />
    </section> 

    <section className="h-full max-h-[640px] mb-8 xl:mb-24 bg-indigo-500">
      <div className="flex flex-col lg:flex-row">
        <div className="lg:ml-8 xl:ml-[135px] flex flex-col items-center lg:items-start text-center lg:text-left justify-center flex-1 px-4 lg:px-0">
          <h1 className="text-4xl lg:text-[58px] font-semibold leading-none mb-6 text-white">
            Encuentra el hogar de tus sueños
          </h1>
          <p className="max-w-[480px] mb-8 text-white">
            Compra, vende o renta propiedades con facilidad. 
            Explora nuestra amplia selección de casas, apartamentos y terrenos.
          </p>
          <Link to="/buy" className="bg-white text-indigo-500 font-bold py-2 px-6 rounded-lg hover:bg-gray-100">
            Explorar propiedades
          </Link>
        </div>
        <div className="hidden flex-1 lg:flex justify-end items-end">
          <img src="Imagenes/img1.png" alt="casa" className="rounded-l-lg object-cover" />
        </div>
      </div>
    </section>

    <section className="container mx-auto p-4 mb-12">
      <h2 className="text-2xl font-bold mb-4 text-indigo-500">¿Por qué elegirnos?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold mb-2">Amplia selección</h3>
          <p className="text-gray-600">Encuentra la propiedad perfecta entre miles de opciones.</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold mb-2">Fácil de usar</h3>
          <p className="text-gray-600">Nuestra plataforma es intuitiva y fácil de navegar.</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold mb-2">Asesoramiento experto</h3>
          <p className="text-gray-600">Nuestro equipo de expertos te ayudará en cada paso del proceso.</p>
        </div>
      </div>
    </section>

    <section className="container mx-auto p-4 bg-gray-100 rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h2 className="text-2xl font-bold text-indigo-500">¿Listo para encontrar tu nuevo hogar?</h2>
          <p className="text-gray-600">Comienza tu búsqueda hoy mismo.</p>
        </div>
        <Link to="/buy" className="bg-indigo-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700">
          Explorar propiedades
        </Link>
      </div>
    </section>
  </>
  );
};

export default Home;