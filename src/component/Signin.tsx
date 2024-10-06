import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, registerUser } from "../services/UserService";


function Signin() {
    const [id, setId] = useState("");
    const [pw1, setPw1] = useState("");
    const [pw2, setPw2] = useState("");

    const navigate = useNavigate();

    const changeId = (e: any) => setId(e.target.value);
    const changePw1 = (e: any) => setPw1(e.target.value);
    const changePw2 = (e: any) => setPw2(e.target.value);

    const handlerSignin = () => {
        if (id == "") {
            alert("아이디를 입력해주세요.");
        } else if (pw1 == "") {
            alert("비밀번호를 입력해주세요.");
        } else if (pw1 != pw2) {
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
                    })
                    alert("회원가입에 성공했습니다! 다시 로그인 해주세요.");
                    navigate('/login');
                }
            })
            .catch(err => console.log(err));
        }
    }

    return (
        <div className="body">
            <div className="centerbox">
                <h1 className="logo">RISI</h1>
                <p>ID</p>
                <input type="text" value={id} onChange={changeId} autoFocus />
                
                <br/>

                <p>PW1</p>
                <input type="text" value={pw1} onChange={changePw1} />

                <br/>

                <p>PW2</p>
                <input type="text" value={pw2} onChange={changePw2} />

                <br/>
                <br/>

                <div className="buttons">
                    <button onClick={handlerSignin}>Sign in</button>
                    <button onClick={() => navigate(-1)}>Cancel</button>
                </div>
            </div>
        </div>
    )
}

export default Signin;