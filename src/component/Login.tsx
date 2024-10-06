import { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { checkUser } from "../services/UserService";

function Login() {

    const [id, setId] = useState("");
    const [pw, setPw] = useState("");

    const navigate = useNavigate();

    const changeId = (e: any) => setId(e.target.value);
    const changePw = (e: any) => setPw(e.target.value);

    const handlerLogin = (e: any) => {
        e.preventDefault();
        
        if (id == "") {
            alert("아이디를 입력해주세요.")
            return;
        } else if (pw == "") {
            alert("비밀번호를 입력해주세요.")
            return;
        }

        checkUser(id, pw)
            .then(res => {
                console.log(res.data);
                if (res.data) {
                    const token = res.data.token;
                    localStorage.setItem('token', token);
                    navigate('/home'); // Navigate to /home if availability is true
                    localStorage.setItem('user', id);
                } else {
                    alert("일치하는 사용자 정보가 없습니다.");
                }
            })
            .catch(err => console.log(err));
    }

    return (
        <div className="body">
            <div className="centerbox">
                <h1 className="logo">RISI</h1>
                <p>ID</p>
                <input type="text" value={id} onChange={changeId} autoFocus />

                <br/>

                <p>PW</p>
                <input type="text" value={pw} onChange={changePw} />

                <br/>
                <br/>

                <div className="buttons">
                    <button onClick={handlerLogin}>Login</button>
                    <button onClick={() => {navigate('/signin')}}>Signin</button>
                </div>
            </div>
        </div>
    )
}

export default Login;