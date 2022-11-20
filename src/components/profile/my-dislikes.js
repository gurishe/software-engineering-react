import Tuits from "../tuits";
import * as service from "../../services/likes-service";
import {useEffect, useState} from "react";

const MyDislikes = () => {
    const [dislikedTuits, setDislikedTuits] = useState([]);
    const findTuitsIDislike = () =>
        service.findAllTuitsDislikedByUser("me")
            .then((tuits) => setDislikedTuits(tuits));

    useEffect(() => {
        findTuitsIDislike()
    }, []);

    return(
        <div>
            {dislikedTuits.length > 0 &&
                <Tuits tuits={dislikedTuits} refreshTuits={findTuitsIDislike} />
            }
            {dislikedTuits.length === 0 &&
                <h3 className={"text-center pt-5"}>You have no disliked Tuits</h3>
            }
        </div>
    );
};

export default MyDislikes;