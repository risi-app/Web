import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, registerUser } from "../services/UserService";
import "./Signin.css";

function Signin() {
    const [id, setId] = useState("");
    const [pw1, setPw1] = useState("");
    const [pw2, setPw2] = useState("");

    const navigate = useNavigate();

    const changeId = (e: any) => setId(e.target.value);
    const changePw1 = (e: any) => setPw1(e.target.value);
    const changePw2 = (e: any) => setPw2(e.target.value);

    const handlerSignin = () => {
        if (id === "") {
            alert("아이디를 입력해주세요.");
        } else if (pw1 === "") {
            alert("비밀번호를 입력해주세요.");
        } else if (pw1 !== pw2) {
            alert("비밀번호가 일치하지 않습니다. 다시 한 번 확인해주세요.");
        } else {
            getUser(id)
                .then(res => {
                    if (res.data) {
                        alert("이미 존재하는 아이디 입니다.");
                    } else {
                        registerUser({
                            userId: id,
                            username: id,
                            password: pw1
                        });
                        alert("회원가입에 성공했습니다! 다시 로그인 해주세요.");
                        navigate('/login');
                    }
                })
                .catch(err => console.log(err));
        }
    };

    return (
        <div className="signin-body">
            <div className="signin-centerbox">
                <h1 className="signin-logo">RISI</h1>
                <div className="signin-form">
                    <label htmlFor="id">ID</label>
                    <input id="id" type="text" value={id} onChange={changeId} autoFocus />

                    <label htmlFor="pw1">Password</label>
                    <input id="pw1" type="password" value={pw1} onChange={changePw1} />

                    <label htmlFor="pw2">Confirm Password</label>
                    <input id="pw2" type="password" value={pw2} onChange={changePw2} />

                    <div className="signin-buttons">
                        <button onClick={handlerSignin} className="signin-btn">Sign Up</button>
                        <button onClick={() => navigate(-1)} className="cancel-btn">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signin;
