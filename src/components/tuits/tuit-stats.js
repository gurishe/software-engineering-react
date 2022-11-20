import React from "react";

const TuitStats = ({tuit, likeTuit, dislikeTuit}) => {
    return (
      <div className="row mt-2">
        <div className="col">
          <i className="far fa-message me-1"></i>
          {tuit.stats && tuit.stats.replies}
        </div>
        <div className="col">
          <i className="far fa-retweet me-1"></i>
          {tuit.stats && tuit.stats.retuits}
        </div>
        <div className="col">
            <span onClick={() => likeTuit(tuit)}>
              {tuit.stats.likes > 0 &&
                  <i className="fa-solid fa-thumbs-up" style={{color: 'mediumblue'}}></i>
              }
              {tuit.stats.likes <= 0 && <i className="fa-solid fa-thumbs-up"></i>}
              {tuit.stats && tuit.stats.likes}
            </span>
        </div>
        <div className="col">
            <span onClick={() => dislikeTuit(tuit)}>
                {tuit.stats.dislikes > 0 &&
                    <i className="fa-solid fa-thumbs-down" style={{color: 'red'}}></i>
                }
                {tuit.stats.dislikes <= 0 && <i className="fa-solid fa-thumbs-down"></i>}
                {tuit.stats && tuit.stats.dislikes}
            </span>
        </div>
        <div className="col">
          <i className="far fa-inbox-out"></i>
        </div>
      </div>
    );
}

export default TuitStats;