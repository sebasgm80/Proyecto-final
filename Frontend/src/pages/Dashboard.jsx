import "./Dashboard.css";
import React from 'react';
import BooksList from "../components/BookList"; // Asegúrate de que la importación es correcta


export const Dashboard = () => {
    return (
        <>
        <div>
            <h1 className="dashboard-title">Este es el dashboard donde puedes ver tus libros</h1>
            <BooksList/>
        </div>
        </>
    );
};


