import React, {useEffect, useState} from "react";
import {Route, Routes, useNavigate} from "react-router-dom";
import * as service from "../../services/auth-service";
import {createTuit} from "../../services/tuits-service";
import MyTuits from "./my-tuits";
import MyLikes from "./my-likes";
import MyDislikes from "./my-dislikes";
import EditProfile from "./edit-profile";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({});
  const [tuit, setTuit] = useState('');

  useEffect(() => {
      const fetchProfile = async () => {
          try {
              const user = await service.profile();
              setProfile(user);
          } catch (e) {
              navigate('/login');
          }
      }
    fetchProfile();
  }, []);

  const logout = () => {
    service.logout(profile).then(() => navigate('/login'));
  }

  return (
      <div>
          <h4>{profile.username}</h4>
          <h6>@{profile.username}</h6>
          <div className={"d-flex justify-content-between mb-2"}>
              <button
                  className={"btn btn-success mb-1"}
                  onClick={() => navigate('mytuits')}
              >
                  My Tuits
              </button>
              <button
                  className={"btn btn-primary mb-1"}
                  onClick={() => navigate('mylikes')}
              >
                  My Likes
              </button>
              <button
                  className={"btn btn-danger mb-1"}
                  onClick={() => navigate('mydislikes')}
              >
                  My Dislikes
              </button>
              <button
                  className={"btn btn-warning"}
                  onClick={logout}
              >
                  Logout
              </button>
          </div>
          <div className={"pb-5"}>
              <textarea
                  value={tuit}
                  onChange={(e) =>
                      setTuit(e.target.value)}
                  placeholder="What do you want to say?"
                  className="w-100 border-1"
              >
              </textarea>
              <button
                  className={'btn btn-success rounded-pill fa-pull-right'}
                  onClick={() => {
                      createTuit(profile.id, tuit);
                      setTuit('');
                  }}
                  disabled={!tuit || !profile}
              >
                  Tuit
              </button>
          </div>

          <Routes>
              <Route path="/mytuits" element={<MyTuits/>}/>
              <Route path="/mylikes" element={<MyLikes/>} />
              <Route path="/mydislikes" element={<MyDislikes/>} />
              <Route path="/edit" element={<EditProfile/>}/>
          </Routes>
    </div>
  );
};

export default Profile;
