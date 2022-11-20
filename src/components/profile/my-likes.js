import Tuits from "../tuits";
import * as service from "../../services/likes-service";
import {useEffect, useState} from "react";

const MyLikes = () => {
    const [likedTuits, setLikedTuits] = useState([]);
    const findTuitsILike = () =>
        service.findAllTuitsLikedByUser("me")
            .then((tuits) => setLikedTuits(tuits));

    useEffect(() => {
        findTuitsILike()
    }, []);

    return(
        <div>
            {likedTuits.length > 0 &&
                <Tuits tuits={likedTuits} refreshTuits={findTuitsILike} />
            }
            {likedTuits.length === 0 &&
                <h3 className={"text-center pt-5"}>You have no liked Tuits</h3>
            }
        </div>
    );
};

export default MyLikes;