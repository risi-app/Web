import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from "react-router-dom";
import "./Detail.css";
import { deletePost, getPost, updatePost } from "../services/PostService";
import { addComment, editComment, deleteComment } from '../services/CommentService';

function Detail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState<any>({});
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [imageSize, setImageSize] = useState(100);  // Initial image size percentage
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState("");
    const userId = localStorage.getItem('user'); // Assumes userId is stored in localStorage
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editingCommentContent, setEditingCommentContent] = useState("");

    interface Comment {
        id: string;
        content: string;
        username: string;
        liked?: boolean;
    }

    // Set up WebSocket for finger distance detection
    useEffect(() => {
        const socket = new WebSocket('ws://localhost:5000/socket.io/?EIO=3&transport=websocket');

        socket.onopen = () => {
            console.log('WebSocket Connection Established');
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.distance) {
                // Map distance to image size (e.g., 50% to 150%)
                const newSize = Math.min(Math.max(50, data.distance * 500), 150);
                setImageSize(newSize);
            }
        };

        return () => socket.close();
    }, []);

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
                const res = await updatePost(id, formData);
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
                id && await deletePost(id);
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

    const handleAddComment = async () => {
        if (newComment.trim() && id && userId) {
            try {
                const res = await addComment(id, userId, newComment);
                if (res.status === 200) {
                    // Get the user's profile image from localStorage or make an API call
                    const userProfileImg = localStorage.getItem('userProfile'); // Assuming you store user profile in localStorage
                    
                    const newCommentObj = {
                        id: res.data.id,
                        content: newComment,
                        username: userId,
                        profileImg: userProfileImg // Add the profile image to the new comment
                    };
                    setComments([...comments, newCommentObj]);
                    setNewComment("");
                }
            } catch (err) {
                console.error("Error adding comment!", err);
            }
        }
    };
    
    const handleDeleteComment = async (commentId: string) => {
        try {
            await deleteComment(commentId);
            setComments(comments.filter(comment => comment.id !== commentId));  // Remove deleted comment from state
        } catch (err) {
            console.error("Error deleting comment!", err);
        }
    };

    const handleEditCommentClick = (comment: Comment) => {
        setEditingCommentId(comment.id);
        setEditingCommentContent(comment.content);
    };

    const handleEditCommentSave = async (commentId: string) => {
        try {
            const res = await editComment(commentId, editingCommentContent);
            if (res.status === 200) {
                setComments(comments.map(comment => 
                    comment.id === commentId 
                        ? { ...comment, content: editingCommentContent }
                        : comment
                ));
                setEditingCommentId(null);
                setEditingCommentContent("");
            }
        } catch (err) {
            console.error("Error editing comment!", err);
        }
    };

    const handleEditCommentCancel = () => {
        setEditingCommentId(null);
        setEditingCommentContent("");
    };

    
    useEffect(() => {
        if (id) {
            getPost(id)
                .then(res => {
                    if (res.data) {
                        console.log(res.data);
                        setPost(res.data);
                        setTitle(res.data.title);
                        setDescription(res.data.description);
                        setComments(res.data.comments);
                    }
                })
                .catch(err => console.log(err));
        }
    }, []);

    const { profile, username, image } = post;

    return (
        <div className="detail_post_body_container">
            <br />
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
                            {image && <img src={`http://localhost:8080${image}`} alt="Uploaded file" style={{ width: `${imageSize}%` }} />}
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
                

                <div className="comments_section">
                    <h3 className='comments_h3'>Comments</h3>
                    
                    {comments.map(comment => (
                        <div key={comment.id} className="comment">
                            <div className='comment_container'>
                                <Link to={`/profile/${comment.username}`} className='comment_user_info'>
                                    <img src={comment.profileImg ? `http://localhost:8080${comment.profileImg}` : `https://austinpeopleworks.com/wp-content/uploads/2020/12/blank-profile-picture-973460_1280.png`}/>
                                    <p>{comment.username}</p>
                                </Link>
                                {editingCommentId === comment.id ? (
                                    <input
                                        value={editingCommentContent}
                                        onChange={(e) => setEditingCommentContent(e.target.value)}
                                        className="comment_edit_input"
                                    />
                                ) : (
                                    <p>{comment.content}</p>
                                )}
                            </div>
                            {editingCommentId === comment.id ? (
                                <div className="comment_edit_buttons">
                                    <img src='/src/assets/save.png' width={35} height={35} onClick={() => handleEditCommentSave(comment.id)}/>
                                    <img src='/src/assets/image.png' width={25} height={25} onClick={handleEditCommentCancel}/>
                                </div>
                            ) : (
                                <>
                                    <div className="comment_actions">
                                        
                                        {userId === comment.username && (
                                            <>
                                                <img src='/src/assets/pen.png' width={30} onClick={() => handleEditCommentClick(comment)}/>
                                                <img src='/src/assets/delete.png' width={30} onClick={() => handleDeleteComment(comment.id)}/>
                                            </>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                    
                    <div className='comment_add_box'>
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                        />
                        <button onClick={handleAddComment}>Add Comment</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Detail;
