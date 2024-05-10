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