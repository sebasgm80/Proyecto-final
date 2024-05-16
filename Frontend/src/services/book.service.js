import { APIuser } from "./serviceApiUser.config";

// Crear un nuevo libro
export const createBook = async (formData) => {
    try {
        const response = await APIuser.post("/books", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating book:", error.response ? error.response.data : error.message);
        throw error;
    }
};

// Obtener todos los libros del usuario
export const getUserBooks = async () => {
    try {
        const response = await APIuser.get("/books/user/books");
        return response.data;
    } catch (error) {
        console.error("Error fetching user's books:", error.response ? error.response.data : error.message);
        throw error;
    }
};

// Obtener detalles de un libro específico
export const getBookDetails = async (bookId) => {
    try {
        const response = await APIuser.get(`/books/${bookId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching book details:", error.response ? error.response.data : error.message);
        throw error;
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
