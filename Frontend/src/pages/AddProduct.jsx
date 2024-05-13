import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import { Uploadfile } from "../components";
import { useCreateProductError } from "../hooks/useCreateProductError";
import { createBook } from "../services/book.service";


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
            <h1>Add Book</h1>
            <input {...register("title", { required: true })} placeholder="Title" />
            {errors.title && <p>Title is required.</p>}
            <input {...register("author")} placeholder="Author" />
            <input {...register("genre")} placeholder="Genre" />
            <input {...register("year")} placeholder="Year" type="number" />
            <input {...register("pages", { required: true })} placeholder="Pages" type="number" />
            <input {...register("image")} type="file" />
            <button type="submit" disabled={send}>Add Book</button>
        </form>
        </>
    );
};
