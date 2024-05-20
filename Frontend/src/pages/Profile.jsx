import { useEffect, useState } from "react"
import Messages from "../components/Messages"
import Wallet from "../components/Wallet"

import "./Profile.css"
import { Link } from "react-router-dom"
import { useWallet } from "../hooks/useWallet"



export const Profile = () => {
  const [user, setUser] = useState({});

  const { balance } = useWallet();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <>
    <div className="profile-container">
    <img src={user.image} alt="User Profile" className="profile-image" />
    <h2 className="name">Nombre: {user.user}</h2>
    <p className="email">Email: {user.email}</p>
    <p className="balance">Bookoins {balance}</p>
    </div>
    


    
      
      <div className="wallet-section">
        <Wallet />
      </div>
      <div className="messages-section">
        <Messages />
      </div>
      <div className="links-section">
        <Link to="/formProfile" className="profile-link">
          Form Profile
        </Link>
        <Link to="/addProduct" className="profile-link">
          Add Product
        </Link>
      </div>
    
    </>
  );
};