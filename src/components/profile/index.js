import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import * as service from "../../services/auth-service";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({});

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
  });

  const logout = () => {
    service.logout(profile).then(() => navigate('/login'));
  }

  return(
      <div>
        <h4>{profile.username}</h4>
        <h6>@{profile.username}</h6>
        <button onClick={logout}>Logout</button>
      </div>
  );
};

export default Profile;
