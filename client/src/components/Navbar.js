import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { logout } from '../api';
import { Menu as MenuIcon } from '@mui/icons-material';
import { AccountCircle as AccountCircleIcon } from '@mui/icons-material';

const Navbar = ({ user, setUser }) => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 0);
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            Cookies.remove('auth-token');
            Cookies.remove('refresh-token');
            setUser(null);
            navigate('/');
        } catch (err) {
            console.error('Error logging out:', err);
        }
    };

    return (
      <header className={`fixed w-full z-10 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
        <div className="container mx-auto flex justify-between items-center px-4">
          <Link to="/" className="flex items-center text-xl font-semibold text-gray-800">
            <img src="Imagenes/logo.png" alt="Sunset Real Estate Logo" className="w-8 h-8 mr-2" />
            <span>Sunset Real Estate</span>
          </Link>
          <div className="flex space-x-8">
            <Link to="/buy" className="nav-link text-gray-600 font-bold hover:text-indigo-500 transition-colors duration-300 relative">Comprar</Link>
            <Link to="/rent" className="nav-link text-gray-600 font-bold hover:text-indigo-500 transition-colors duration-300 relative">Rentar</Link>
            <Link to="/finance" className="nav-link text-gray-600 font-bold hover:text-indigo-500 transition-colors duration-300 relative">Financiar</Link>
          </div>
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-800">Hola, {user.username}</span>
                <div className="relative">
                  <button 
                    onClick={() => setMenuOpen(!menuOpen)} 
                    className="flex items-center space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold py-2 px-4 rounded-full focus:outline-none"
                  >
                    <MenuIcon className="w-6 h-6" />
                    <AccountCircleIcon className="w-8 h-8 rounded-full" />
                  </button>
                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md">
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setMenuOpen(false)}
                      >
                        Perfil
                      </Link>
                      <Link 
                        to="/my-properties" 
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setMenuOpen(false)}
                      >
                        Mis Propiedades
                      </Link>
                      <Link 
                        to="/create-property" 
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setMenuOpen(false)}
                      >
                        Crear Propiedad
                      </Link>
                      <button 
                        onClick={handleLogout} 
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Cerrar Sesión
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
              >
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      </header>
    );
};

export default Navbar;
