import axios from "axios";
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

// Obtener todos los libros del usuario
export const getUserBooks = async () => {
    try {
        const response = await APIuser.get("books/user/books");
        updateToken(response.headers); // Actualizar el token si es necesario
        return response.data; // Retornar los datos directamente
    } catch (error) {
        console.error("Error fetching user's books:", error.response ? error.response.data : error.message);
        throw error;
    }
};

// Obtener detalles de un libro específico
export const getBookDetails = async (bookId) => {
    try {
        const response = await APIuser.get(`/books/${bookId}`);
        updateToken(response.headers); // Actualizar el token si es necesario
        return response.data; // Retornar los datos directamente
    } catch (error) {
        console.error("Error fetching book details:", error.response ? error.response.data : error.message);
        throw error; // Lanzar el error para que pueda ser capturado y manejado en el componente
    }
};


// Obtener todos los libros
export const getAllBooks = async () => {
    try {
      const response = await APIuser.get('/books');
      return response.data;
    } catch (error) {
      console.error('Error retrieving books:', error.response ? error.response.data : error.message);
      throw new Error(error.response?.data?.message || 'Error retrieving books');
    }
  };

  // Realizar una compra de un libro
export const purchaseBook = async (bookId) => {
    try {
      const response = await APIuser.post(`/books/${bookId}/purchase`);
      return response.data;
    } catch (error) {
      console.error('Error purchasing book:', error.response ? error.response.data : error.message);
      throw new Error(error.response?.data?.message || 'Error purchasing book');
    }
  };