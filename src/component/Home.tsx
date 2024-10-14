import { useEffect, useState } from "react";
import Post from "./Post";
import "./Home.css"
import { getPosts } from "../services/PostService";

function Home() {

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        getPosts()
            .then(res => {
                res && setPosts(res.data.reverse())
                console.log(res.data);
            })
            .catch(err => console.log(err))
    }, [])

    

    return (
        <div className="">
            <br/>
            <br/>
            {
                posts.map((post: any) => {
                    const {id, username, profile, title, description, image, likes} = post;
                    return <Post key={id} id={id} username={username} profile={profile} title={title} description={description} image={image} likes={likes}/>
                })
            }
            <br/>
            <br/>
        </div>
    )
}

export default Home;