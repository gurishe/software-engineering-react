import React from "react";
import './tuits.css';
import Tuit from "./tuit";
import * as likesService from "../../services/likes-service";

const Tuits = ({tuits = [], deleteTuit, refreshTuits}) => {
    const likeTuit = (tuit) =>
        likesService
            .userTogglesTuitLikes("me", tuit.id)
            .then(refreshTuits)
            .catch(e => alert(e))

    const dislikeTuit = (tuit) =>
        likesService
            .userTogglesTuitDislikes("me", tuit.id)
            .then(refreshTuits)
            .catch(e => alert(e))

    return (
        <div>
            <ul>
                {tuits.map(tuit =>
                    <Tuit key={tuit.id}
                          deleteTuit={deleteTuit}
                          likeTuit={likeTuit}
                          dislikeTuit={dislikeTuit}
                          tuit={tuit}
                    />
                )}
            </ul>
        </div>
    );
}


export default Tuits;