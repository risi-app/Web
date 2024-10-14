import { useParams, useNavigate, Link } from "react-router-dom";
import "./Detail.css";
import { useEffect, useState } from "react";
import { deletePost, getPost, updatePost } from "../services/PostService";
import "./Detail.css";

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
        <div className="detail_post_body_container">
            <br/>
            <div className="detail_post_body">
                <div className="post_user_info">
                    <Link to={`/profile/${username}`} className="post_user_info_container">
                        <img src={profile ? `http://localhost:8080${profile}` : `https://austinpeopleworks.com/wp-content/uploads/2020/12/blank-profile-picture-973460_1280.png`} />
                    </Link>
                    <div className="username_and_bottons">
                        <h3>{username}</h3>
                        <div>
                            {localStorage.getItem('user') === (username || "Admin") && 
                                <div className="post_buttons">
                                    {isEditing ? (
                                        <>
                                            <button className="button_blue" onClick={handleSaveClick}>Save</button>
                                            <button className="button_red" onClick={() => setIsEditing(false)}>Cancel</button>
                                        </>
                                    ) : (
                                        <>
                                            <button className="button_blue" onClick={handleEditClick}>Edit</button>
                                            <button className="button_red" onClick={handleDeleteClick}>Delete</button>
                                        </>
                                    )}
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div className="detail_post_container">
                    <div className="detail_post_info">
                        <div className="detail_post_image">
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
            </div>
        </div>
    );
}

export default Detail;
