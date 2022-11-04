import React from "react";
import {Link} from "react-router-dom";

export const UserList = ({users, deleteUser}) => {
  return (
    <div className="list-group">
      {
        users.map(user => {
          return (
            <Link className="list-group-item"
                  key={user.id}
                  to={`/home/${user.id}`}>
          <span key={`username-${user.id}`} className="fs-3">
            {user.username}
          </span>
              <button onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                deleteUser(user.id)
              }} className="btn btn-danger fa-pull-right">
                <i className="fas fa-remove"></i>
              </button>
            </Link>
          )
        })
      }
    </div>)
};
