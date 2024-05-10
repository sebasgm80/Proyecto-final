import "./Register.css";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Uploadfile } from "../components";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { registerUser } from "../services/user.service.js";
import { useRegisterError } from "../hooks/useRegisterError.jsx";


export const Register = () => {
    // Estados y funciones
    const navigate = useNavigate();
    const { register, handleSubmit } = useForm();
    const { allUser, setAllUser, bridgeData } = useAuth();
    const [res, setRes] = useState({});
    const [send, setSend] = useState(false);
    const [okRegister, setOkRegister] = useState(false);

    //! ---------------------------------------------------------------------------
    //? 1) Funcion que se encarga del formulario - de la data del formulario
    //! ---------------------------------------------------------------------------

    const formSubmit = async(formData) => {
        const inputFile = document.getElementById('file-upload').files;

        if (inputFile.length != 0) {
            // si es diferente a 0 quiere decir que tenemos una imagen
            const custonFormData = {
                ...formData,
                image: inputFile[0],
            };

            setSend(true);
            setRes(await registerUser(custonFormData));
            setSend(false);
        } else {
            const custonFormData = {
                ...formData,
            };

            setSend(true);
            setRes(await registerUser(custonFormData));
            setSend(false);
        }
    };

    //! ---------------------------------------------------------------------------
    //? 2) useEffect que van gestionar las respuestas y errores -- useRegisterError.jsx
    //! ---------------------------------------------------------------------------

    useEffect(() => {
        console.log('soy res 🥶', res);
        useRegisterError(res, setOkRegister, setRes);
        if (res?.status == 200) bridgeData("ALLUSER"); 
    }, [res]);

    useEffect(() => {
        console.log("soy allUser 😀", allUser);
    }, [allUser])
    

    //! ---------------------------------------------------------------------------
    //? 3) Estados de navegación
    //! ---------------------------------------------------------------------------

    if(okRegister){
        return <Navigate to='/login'/>
    }

    return (
    <>
        <div className="form-wrap">
            <h1>Sign Up</h1>
            <p>Es gratis y solo te tomara un minuto</p>
            <form onSubmit={handleSubmit(formSubmit)}>
            <div className="user_container form-group">
                <input
                className="input_user"
                type="text"
                id="name"
                name="name"
                autoComplete="false"
                {...register("name", { required: true })}
                />
                <label htmlFor="custom-input" className="custom-placeholder">
                username
                </label>
            </div>
            <div className="password_container form-group">
                <input
                className="input_user"
                type="password"
                id="password"
                name="password"
                autoComplete="false"
                {...register("password", { required: true })}
                />
                <label htmlFor="custom-input" className="custom-placeholder">
                password
                </label>
            </div>

            <div className="email_container form-group">
                <input
                className="input_user"
                type="email"
                id="email"
                name="email"
                autoComplete="false"
                {...register("email", { required: true })}
                />
                <label htmlFor="custom-input" className="custom-placeholder">
                email
                </label>
                <Uploadfile />
            </div>

            <div className="btn_container">
                <button
                className="btn"
                type="submit"
                disabled={send}
                style={{ background: send ? "#49c1a388" : "#2f7a67" }}
                >
                { send ? "Cargando..." : "Register" }
                </button>
            </div>
            <p className="bottom-text">
                <small>
                Al hacer clic en el botón de Registro, estás aceptando nuestros
                <Link className="anchorCustom" to="/terms">Terminos & Condiciones</Link> and{" "}
                <Link className="anchorCustom" to="/privace">Política de Privacidad</Link>.
                </small>
            </p>
            </form>
        </div>
        <div className="footerForm">
            <p className="parrafoLogin">
            ¿Tienes una cuenta? <Link to="/login">Login Here</Link>
            </p>
        </div>
    </>
    )
}


