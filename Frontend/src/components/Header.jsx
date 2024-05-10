import { NavLink } from "react-router-dom";
import "./Header.css";
import { useAuth } from "../context/authContext";

export const Header = () => {
    const { user, logout } = useAuth();
    return (
        <>
        <header>
            <div className="titleFatherContainer">
            <img
                src="https://res.cloudinary.com/dikiljqbn/image/upload/v1714327295/Helena_Paquet_kpk984.png"
                alt="logo"
                className="logo"
            />
            <div className="titleContainer">
                <h1 className="titleHeader">ENGINEPIXEL</h1>
                <h1 className="titleHeaderBlack">ENGINEPIXEL</h1>
            </div>
            </div>
            <nav>
            {user == null && (
                <NavLink to="/login">
                <img
                    src="https://res.cloudinary.com/dikiljqbn/image/upload/v1713982208/login_FILL0_wght400_GRAD0_opsz24_v1kjq9.svg"
                    alt=""
                    className="iconNav"
                /><span className="tooltip-text1">Login</span>
                </NavLink>
            )}

            {user !== null ? (
                <NavLink to="/dashboard">
                <img
                    src="https://res.cloudinary.com/dikiljqbn/image/upload/v1713981566/dashboard_FILL0_wght400_GRAD0_opsz24_xas5qf.svg"
                    alt=""
                    className="iconNav iconDashBoard"
                /><span className="tooltip-text1">Dashboard</span>
                </NavLink>
            ) : null}

            <NavLink to="/">
                <img
                src="https://res.cloudinary.com/dikiljqbn/image/upload/v1713981429/home_FILL0_wght400_GRAD0_opsz24_nqe8fx.svg"
                alt=""
                className="iconNav home"
                /><span className="tooltip-text1">Home</span>
            </NavLink>
            {user !== null && (
                <img
                src="https://res.cloudinary.com/dikiljqbn/image/upload/v1713981484/logout_FILL0_wght400_GRAD0_opsz24_xpluju.svg"
                alt=""
                className="iconNav iconLogout"
                onClick={() => logout()}
                />
            )}
            {user !== null ? (
                <><span className="tooltip-text1">Logout</span>
                <NavLink to="/profile">
                    <img
                    className="profileCircle"
                    src={user.image}
                    alt={user.user}
                    /><span className="tooltip-text1">Profile</span>
                </NavLink>
                </>
            ) : null}
            {}
            </nav>
        </header>
        <div className="whiteContainer"></div>
        </>
    );
};
