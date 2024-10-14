import { useState, ChangeEvent, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Add.css";
import { uploadPost } from "../services/PostService";

function Add() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const refFiles = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);

    const changeTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const changeDescription = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
    };

    const handlerChangeFiles = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;

        if (selectedFiles && selectedFiles.length > 1) {
            alert("Only one image can be uploaded.");
            if (refFiles.current) {
                refFiles.current.value = "";
            }
            setFile(null);
            return;
        }

        if (selectedFiles) {
            const file = selectedFiles[0];
            if (file.type.startsWith("image/")) {
                setFile(file);
            } else {
                alert("Only image files are allowed.");
                if (refFiles.current) {
                    refFiles.current.value = "";
                }
                setFile(null);
            }
        }
    };

    const navigate = useNavigate();

    const handlerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        if (file) {
            formData.append('file', file);
        }
    
        try {
            const res = await uploadPost(localStorage.getItem('user')!, formData); // Use the uploadPost service method
            if (res.status === 200) {
                navigate('/home');
            }
        } catch (err) {
            console.error("There was an error uploading the post!", err);
            alert("There was an error uploading the post!");
        }
    };

    return (
        <div className="total_body">
            <h1>Add</h1>
            <form className="form_body" onSubmit={handlerSubmit} encType="multipart/form-data">
                <input type="text" name="title" value={title} onChange={changeTitle} />
                <textarea name="description" value={description} onChange={changeDescription} />
                {description.length}
                <input type="file" id="file" name="file" ref={refFiles} onChange={handlerChangeFiles} />
                <input type="submit" id="submit" value="Upload"/>
            </form>
        </div>
    );
}

export default Add;
