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
            &nbsp;
            <input
                className={"mb-1"}
                onChange={(e) => setLoginUser(
                    {...loginUser, username: e.target.value}
                )}
            />
            <br />
            <label>Password: </label>
            &nbsp;
            <input
                className={"mb-1"}
                onChange={(e) => setLoginUser(
                    {...loginUser, password: e.target.value}
                )}
            />
            <br />
            <button className={"btn btn-primary"} onClick={login}>Login</button>
        </div>
    );
};
