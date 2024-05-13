import { useNavigate } from 'react-router-dom';
import "./Home.css";
import LazyImage from '../components/LazyImage'; // Asegúrate de que el componente LazyImage está correctamente importado.

export const Home = () => {
    const navigate = useNavigate();  // Hook para la navegación

    return (
        <section className="hero">
            <div className="hero-background">
                {/* Aquí puedes agregar un fondo al hero si es necesario, como un color sólido o imagen */}
            </div>
            <div className="hero-content">
                <h1>Revive Cada Historia – Intercambia Tus Libros Con Amantes de la Lectura Como Tú</h1>
                <p>Únete a nuestra comunidad y descubre un mundo infinito de libros sin gastar más.</p>
                <button onClick={() => navigate('/register')} className="join-now-button">Únete Ahora</button>
            </div>
        </section>
    );
}
