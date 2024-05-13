import { updateToken } from "../utils";
import { APIuser } from "./serviceApiUser.config";

// Create a new product
export const createBook = async (formData) => {
    return APIuser.post("/books", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    })
        .then((res) => res)
        .catch((error) => error);
};