import {useNavigate} from "react-router-dom";
import {useState} from "react";
import * as service from "../../services/auth-service";

export const Login = () => {
    const [loginUser, setLoginUser] = useState({});
    const navigate = useNavigate()
    const login = () =>
        service.login(loginUser)
            .then((user) => navigate('/profile/mytuits'))
            .catch(e => alert(e));
    return (
        <div>
            <h1>Login</h1>
            <label>Username: </label>
            <input
                onChange={(e) => setLoginUser(
                    {...loginUser, username: e.target.value}
                )}
            />
            <br />
            <label>Password: </label>
            <input
                onChange={(e) => setLoginUser(
                    {...loginUser, password: e.target.value}
                )}
            />
            <br />
            <button onClick={login}>Login</button>
        </div>
    );
};
