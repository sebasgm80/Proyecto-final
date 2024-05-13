import { updateToken } from "../utils";
import { APIuser } from "../services/serviceApiUser.config";


//! ------------------------------- REGISTER -----------------------------------
export const registerUser = async (formData) => {
  return APIuser.post("/users/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
    .then((res) => res)
    .catch((error) => error);
};


//! -------------------------------- LOGIN -------------------------------------

export const loginUserService = async (formData) => {
  return APIuser.post("/users/login", formData)
    .then((res) => res)
    .catch((error) => error);
};


//! ------------------------------------BORRADO DEL USUARIO----------------------

export const deleteUserService = async () => {
  return APIuser.delete("/users/", {
    headers: {
      Authorization: `Bearer ${updateToken()}`,
    },
  })
    .then((res) => res)
    .catch((error) => error);
};


//! ------------------------------ UPDATE USER -----------------------

export const updateUser = async (formData) => {
  return APIuser.patch("/users/user/update", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${updateToken()}`,
    },
  })
    .then((res) => res)
    .catch((error) => error);
};

// Obtener los bookoins del usuario
export const getUserBookoins = async () => {
  try {
      const response = await APIuser.get("/user/bookoins");
      updateToken(response.headers); // Actualizar el token si es necesario
      return response.data; // Retornar los datos directamente
  } catch (error) {
      console.error("Error fetching user's bookoins:", error.response ? error.response.data : error.message);
      throw error;
  }
}