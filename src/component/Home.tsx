import { useEffect, useState } from "react";
import Post from "./Post";
import axios from "axios";
import "./Home.css"

function Home() {

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8080/api/post/get')
            .then(res => {
                res && setPosts(res.data.reverse())
                console.log(res.data);
            })
            .catch(err => console.log(err))
    }, [])

    

    return (
        <div className="middle_content">
            {
                posts.map((post: any) => {
                    const {id, username, profile, title, description, image, likes} = post;
                    return <Post key={id} id={id} username={username} profile={profile} title={title} description={description} image={image} likes={likes}/>
                })
            }
            <div>
                <br/>
                <br/>
            </div>
        </div>
    )
}

export default Home;