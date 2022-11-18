import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import * as service from "../../services/auth-service";
import {createTuit} from "../../services/tuits-service";

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
          <div className={"mb-2"}>
              <button
                  className={"btn btn-primary mb-1"}
                  onClick={() => navigate('/profile/mytuits')}
              >
                  Go to my tuits
              </button>
              <br />
              <button
                  className={"btn btn-warning"}
                  onClick={logout}
              >
                  Logout
              </button>
          </div>
          <div>
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
      </div>
  );
};

export default Profile;
