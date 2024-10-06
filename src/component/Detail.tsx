import { useParams, useNavigate } from "react-router-dom";
import "./Detail.css";
import { useEffect, useState } from "react";
import { deletePost, getPost, updatePost } from "../services/PostService";

function Detail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState<any>({});
    const [isEditing, setIsEditing] = useState(false); // Track edit mode
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        id &&
        getPost(id)
            .then(res => {
                if (res.data) {
                    setPost(res.data);
                    setTitle(res.data.title);
                    setDescription(res.data.description);
                }
            })
            .catch(err => console.log(err));
    }, [id]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        if (file) {
            formData.append('file', file);
        }
    
        if (id) {
            try {
                const res = await updatePost(id, formData); // Use the updatePost service method
                if (res.status === 200) {
                    setPost(res.data);
                    setIsEditing(false);
                }
            } catch (err) {
                console.error("Error updating post!", err);
            }
        }
    };

    const handleDeleteClick = async () => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            try {
                id &&
                await deletePost(id);
                navigate("/home");
            } catch (err) {
                console.error("Error deleting post!", err);
            }
        }
    };

    const handleTitleChange = (e: any) => {
        setTitle(e.target.value);
    };

    const handleDescriptionChange = (e: any) => {
        setDescription(e.target.value);
    };

    const handleFileChange = (e: any) => {
        setFile(e.target.files[0]);
    };

    const { profile, username, image } = post;

    return (
        <div className="detail_post_body">
            <div className="post_user_info">
                <img src={profile ? `http://localhost:8080${profile}` : `https://austinpeopleworks.com/wp-content/uploads/2020/12/blank-profile-picture-973460_1280.png`} />
                <h3>{username}</h3>
                {localStorage.getItem('user') === (username || "Admin") && 
                    <div className="post_buttons">
                        {isEditing ? (
                            <>
                                <button className="button_blue" onClick={handleSaveClick}>저장</button>
                                <button className="button_red" onClick={() => setIsEditing(false)}>취소</button>
                            </>
                        ) : (
                            <>
                                <button className="button_blue" onClick={handleEditClick}>수정</button>
                                <button className="button_red" onClick={handleDeleteClick}>삭제</button>
                            </>
                        )}
                    </div>
                }
            </div>
            <div className="post_info">
                <div className="post_image">
                    {image && <img src={`http://localhost:8080${image}`} alt="Uploaded file" />}
                </div>
                <div className="post_writings">
                    {isEditing ? (
                        <>
                            <input type="text" value={title} onChange={handleTitleChange} />
                            <textarea value={description} onChange={handleDescriptionChange} rows={4} />
                            <input type="file" onChange={handleFileChange} />
                        </>
                    ) : (
                        <>
                            <h3>{title}</h3>
                            <p>{description}</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Detail;
