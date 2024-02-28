import React, { useState } from 'react';
import "./RatingStars.css";

const RatingStars = ({ onRating }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0); // Pour gérer l'état de survol

  return (
    <div className="rating">
      {[...Array(5)].map((star, index) => {
        index += 1;
        return (
          <button
            type="button"
            key={index}
            className={index <= (hover || rating) ? "on" : "off"}
            onClick={() => setRating(index)}
            onMouseEnter={() => setHover(index)}
            onMouseLeave={() => setHover(rating)}
          >
            <span className="star">&#9733;</span>
          </button>
        );
      })}
    </div>
  );
};

export default RatingStars;
