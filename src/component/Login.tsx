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

        if (id === "") {
            alert("아이디를 입력해주세요.");
            return;
        } else if (pw === "") {
            alert("비밀번호를 입력해주세요.");
            return;
        }

        checkUser(id, pw)
            .then(res => {
                console.log(res.data);
                if (res.data) {
                    const token = res.data.token;
                    localStorage.setItem('token', token);
                    navigate('/home');
                    localStorage.setItem('user', id);
                } else {
                    alert("일치하는 사용자 정보가 없습니다.");
                }
            })
            .catch(err => console.log(err));
    };

    return (
        <div className="login-body">
            <div className="login-centerbox">
                <h1 className="login-logo">RISI</h1>
                <div className="login-form">
                    <label htmlFor="id">ID</label>
                    <input id="id" type="text" value={id} onChange={changeId} autoFocus />

                    <label htmlFor="pw">Password</label>
                    <input id="pw" type="password" value={pw} onChange={changePw} />

                    <div className="login-buttons">
                        <button onClick={handlerLogin} className="login-btn">Login</button>
                        <button onClick={() => {navigate('/signin')}} className="signin-btn">Signup</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
