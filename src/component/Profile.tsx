import axios from "axios";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import "./Profile.css";
import Post from "./Post";
import { useParams } from "react-router-dom";

function Profile() {
    const { id } = useParams();
    const [user, setUser] = useState<any>({});
    const [description, setDescription] = useState("");
    const [isEditing, setIsEditing] = useState(false); // Track edit mode
    const refFiles = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [showPasswordInput, setShowPasswordInput] = useState(false); // Track password input visibility
    const [password, setPassword] = useState(""); // Track password input

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
            setPreviewUrl(null);
            return;
        }

        if (selectedFiles) {
            const file = selectedFiles[0];
            if (file.type.startsWith("image/")) {
                setFile(file);
                const newPreviewUrl = URL.createObjectURL(file);
                setPreviewUrl(newPreviewUrl);  // Set the preview URL
            } else {
                alert("Only image files are allowed.");
                if (refFiles.current) {
                    refFiles.current.value = "";
                }
                setFile(null);
                setPreviewUrl(null);
            }
        }
    };

    useEffect(() => {
        axios.get(`http://localhost:8080/api/user/${id}`)
            .then(res => {
                if (res.data) {
                    setUser(res.data);
                    console.log(res.data);
                    setDescription(res.data.description || "");  // Set the description for the input field
                    setPreviewUrl(null);
                }
            })
            .catch(err => console.log(err));
    }, []);

    const handleSave = async () => {
        const formData = new FormData();

        if (file) {
            formData.append('file', file);
        }
        formData.append('description', description);

        try {
            const res = await axios.put(`http://localhost:8080/api/user/update/${localStorage.getItem('user')}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.status === 200) {
                setUser(res.data);
                setPreviewUrl(null);  // Clear the preview URL after saving
                setIsEditing(false);  // Exit edit mode
                alert("Profile updated successfully!");
            }
        } catch (err) {
            console.error("There was an error updating the profile!", err);
            alert("There was an error updating the profile!");
        }
    };

    const handleImageClick = () => {
        if (refFiles.current) {
            refFiles.current.click();
        }
    };

    const handleSignOutClick = () => {
        setShowPasswordInput(true);
    };

    const handleSignOutConfirm = async () => {
        try {
            await axios.delete(`http://localhost:8080/api/user/delete/${localStorage.getItem('user')}/${password}`);
            localStorage.removeItem('user');
            window.location.href = '/login';
        } catch (err) {
            console.error("Error deleting user!", err);
            alert("Different password");
        }
    };

    return (
        <div className="body_profile">
            <img 
                src={previewUrl || (user.image ? `http://localhost:8080${user.image}` : `https://austinpeopleworks.com/wp-content/uploads/2020/12/blank-profile-picture-973460_1280.png`)} 
                alt="Profile" 
                onClick={handleImageClick}
                style={{ cursor: 'pointer' }}  // Add cursor pointer for better UX
            />
            <input 
                type="file" 
                id="file" 
                name="file" 
                ref={refFiles} 
                onChange={handlerChangeFiles} 
                style={{ display: 'none' }}  // Hide the file input
            />
            <h1>{user.username}</h1>
            <div className="description-container">
                {isEditing ? (
                    <textarea 
                        value={description} 
                        onChange={changeDescription} 
                        placeholder="Enter your description"
                        rows={4}
                        cols={50}
                    />
                ) : (
                    <p>{description === "" ? "No description" : description}</p>
                )}
                <button onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? "Cancel" : "Edit description"}
                </button>
            </div>
            <button onClick={handleSave}>Save</button>
            <button onClick={() => {
                localStorage.removeItem('user');
                window.location.href = '/login';
            }}>Log out</button>
            <button onClick={handleSignOutClick}>Delete Account</button>
            {showPasswordInput && (
                <div className="signout-container">
                    <input 
                        className="password_check"
                        type="password" 
                        placeholder="Enter your password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button onClick={handleSignOutConfirm}>Confirm Delete Account</button>
                </div>
            )}
            <h2>{user.username}'s posts</h2>
            {
                user.posts && user.posts.slice().reverse().map((post: any) => {
                    const {id, username, profile, title, description, image, likes} = post;
                    return <Post key={id} id={id} username={username} profile={profile} title={title} description={description} image={image} likes={likes}/>
                })
            }
        </div>
    );
}

export default Profile;
