import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import { Uploadfile } from "../components";
import { useCreateProductError } from "../hooks/useCreateProductError";
import { createBook } from "../services/book.service";
import "./AddProduct.css";


export const AddBook = () => {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const [res, setRes] = useState({});
    const [send, setSend] = useState(false);
    const [okCreate, setOkCreate] = useState(false);

    const formSubmit = async (formData) => {
        const data = new FormData();
        for (const key in formData) {
            if (formData[key] instanceof FileList) { // Asegurarte de manejar la imagen como archivo
                data.append(key, formData[key][0]);
            } else {
                data.append(key, formData[key]);
            }
        }

        setSend(true);
        try {
            const createdBook = await createBook(data); // Modificar para enviar FormData
            setRes(createdBook);
            setOkCreate(true); // Actualizar según el resultado de la creación
        } catch (error) {
            console.error("Failed to create book:", error);
            setRes(error);
        }
        setSend(false);
    };

    useEffect(() => {
        console.log(res);
        useCreateProductError(res, setRes, setOkCreate);
    }, [res]);

    if (okCreate) {
        return <Navigate to="/dashboard" />;
    }

    return (
        <>
        <form onSubmit={handleSubmit(formSubmit)}>
            <h1>Añadir libro</h1>
            <input {...register("title", { required: true })} placeholder="Titulo" />
            {errors.title && <p>El campo es obligatorio</p>}
            <input {...register("author")} placeholder="Autor" />
            <input {...register("genre")} placeholder="Genero" />
            <input {...register("year")} placeholder="Año" type="number" />
            <input {...register("pages", { required: true })} placeholder="Paginas" type="number" />
            {errors.pages && <p>El campo es obligatorio</p>}
            <input {...register("image", { required: true })} type="file" />
            {errors.image && <p>La imagen es obligatoria</p>}
            <button type="submit" disabled={send}>Añadir libro</button>
        </form>
        </>
    );
};
