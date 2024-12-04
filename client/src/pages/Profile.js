import React from 'react';

const Profile = ({ user }) => {
    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-3xl font-bold mb-4">Perfil de Usuario</h2>
            <div className="bg-white shadow-md rounded p-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Nombre de Usuario</label>
                    <p className="text-gray-900">{user.username}</p>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Correo Electrónico</label>
                    <p className="text-gray-900">{user.email}</p>
                </div>
                {/* Agrega aquí más campos según la información del usuario */}
            </div>
        </div>
    );
};

export default Profile;
