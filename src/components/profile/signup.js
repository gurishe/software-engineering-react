import {useState} from "react";
import * as service from "../../services/auth-service";
import {useNavigate} from "react-router-dom";

const Signup = () => {
    const [newUser, setNewUser] = useState({});
    const navigate = useNavigate();
    const signup = () =>
        service.signup(newUser)
            .then(() => navigate('/profile'))
            .catch(e => alert(e));
    return (
        <div>
            <h1>Signup</h1>
            <label>Username: </label>
            &nbsp;
            <input
                className={"mb-1"}
                onChange={(e) => setNewUser({...newUser, username: e.target.value})}
            />
            <br/>
            <label>Password: </label>
            &nbsp;
            <input className={"mb-1"}
                   onChange={(e) => setNewUser({...newUser, password: e.target.value})}
            />
            <br/>
            <label>Email: </label>
            &nbsp;
            <input
                className={"mb-1"}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
            />
            <br/>
            <button className={"btn btn-success"} onClick={signup}>Signup</button>
        </div>
    );
}
export default Signup;