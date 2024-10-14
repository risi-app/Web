import { Link } from "react-router-dom";
import "./Post.css"

function Post(props: any) {

    const {id, profile, username, image, title, description} = props;

    return (
        <div className="post_container">
            <div className="post_body">
                <div className="post_user_info_container">
                    <Link to={`/profile/${username}`} className="post_user_info">
                        <img src={profile ? `http://localhost:8080${profile}` : `https://austinpeopleworks.com/wp-content/uploads/2020/12/blank-profile-picture-973460_1280.png`} />
                        <h3>{username}</h3>
                    </Link>
                </div>
                <Link to={`/detail/${id}`} className="post_info_container">
                    <div className="post_info">
                        <div className="post_image">
                            {image && <img src={`http://localhost:8080${image}`} alt="Uploaded file" />}
                        </div>
                        
                    </div>
                </Link>
                <div className="post_writings">
                    <h3>{title}</h3>
                    <p>{description}</p>
                </div>
            </div>
        </div>
    )
}

export default Post;