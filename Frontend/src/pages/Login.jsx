import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { loginUserService } from "../services/user.service";
import { useLoginError } from "../hooks";
import "./Login.css";

export const Login = () => {
  //! ------------- Estados -----------------------------------------------------
  const { register, handleSubmit } = useForm();
  const [res, setRes] = useState({});
  const [send, setSend] = useState(false);
  const [loginOk, setLoginOk] = useState(false);
  const { login, setUser } = useAuth();

  //! ------------- Funcion que gestiona la data del formulario -----------------
  const formSubmit = async(formData) => {
      setSend(true);
      setRes(await loginUserService(formData));
      setSend(false);
  };

  //! ------------- useEffect ascociados a la res para gestionar los errores ----
  // 1) --- gestiona errores de la res
  useEffect(() => {
      console.log('Login 😀', res);
      useLoginError(res, setRes, login, setLoginOk)
  }, [res]);

  // 2) --- checkea que un usuario esté logueado y verificado
  /** puede estar logueado sin estar chekeado pero no dejamos que entre en ninguna página
   * en la que no esté autorizado como usuario verificado
   * ---> Este useEffect desloguea al usuario si ve que no está chek
   */
  useEffect(() => {
      setUser(() => null);
      localStorage.removeItem('user');
  }, []);

  //! ------------- Los condicionales que gestionan los estados de navegación ---
  if(loginOk){
      if (res.data.user.check == false) {
          return <Navigate to='/verifyCode' />;
      } else {
          return <Navigate to='/dashboard' />
      }
  }

  return (
      <>
          <div className="form-wrap">
          <h1>Sign In</h1>
          <p>Estamos felices de verte de nuevo 💌</p>
          <form onSubmit={handleSubmit(formSubmit)}>
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
              </div>
  
              <div className="btn_container">
              <button
                  className="btn"
                  type="submit"
                  disabled={send}
                  style={{ background: send ? "#49c1a388" : "#49c1a2" }}
              >
                  LOGIN
              </button>
              </div>
              <p className="bottom-text">
              <small>
              ¿Has olvidado la contraseña?
                  <Link to="/forgotpassword" className="anchorCustom">
                  Cambiar la contraseña
                  </Link>
              </small>
              </p>
          </form>
          </div>
          <div className="footerForm">
          <p className="parrafoLogin">
          ¿No estás registrado? <Link to="/register" className="anchorCustom">Registrase aqui</Link>
          </p>
          </div>
      </>
  )
}

