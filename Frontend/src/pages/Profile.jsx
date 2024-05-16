

import Messages from "../components/Messages"
import Wallet from "../components/Wallet"
import "./Profile.css"
import { Link } from "react-router-dom"


export const Profile = () => {
  return (
    <div>
     <Wallet />
     <Messages />
     <Link to="/formProfile"><h2>Form Profile</h2></Link>
     <Link to="/addProduct"><h2>Add Product</h2></Link>
    </div>
  )
}
