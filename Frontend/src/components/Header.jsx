import { NavLink } from "react-router-dom";
import "./Header.css";
import { useAuth } from "../context/authContext";

export const Header = () => {
    const { user, logout } = useAuth();
    return (
        <header className="transparent-header">
            <div className="titleFatherContainer">
                <NavLink to="/">
                    <img
                        src="https://res.cloudinary.com/dikiljqbn/image/upload/v1715534240/logo_abzvc9.png"
                        alt="logo"
                        className="logo"
                    />
                </NavLink>
            </div>
            <nav className="nav-container">
                <NavLink to="/">
                    <button className="btn btn-transparent">Home</button>
                </NavLink>
                <NavLink to="/Books">
                    <button className="btn btn-transparent">Libros</button>
                </NavLink>

                {user ? (
                    <>
                        <NavLink to="/dashboard">
                            <button className="btn btn-solid">Dashboard</button>
                        </NavLink>
                        <button className="btn btn-transparent" onClick={logout}>Logout</button>
                        <NavLink to="/profile">
                            <img
                                className="profileCircle"
                                src={user.image}
                                alt="profile"
                            />
                        </NavLink>
                    </>
                ) : (
                    <NavLink to="/login">
                        <button className="btn btn-transparent">Login</button>
                    </NavLink>
                )}
            </nav>
        </header>
    );
};
