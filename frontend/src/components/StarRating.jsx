import { useState } from 'react';
import { FiStar } from 'react-icons/fi';

export default function StarRating({ rating, setRating, readOnly = false }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= (hover || rating);
        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => setRating?.(star)}
            onMouseEnter={() => !readOnly && setHover(star)}
            onMouseLeave={() => !readOnly && setHover(0)}
            className={`${readOnly ? 'cursor-default' : 'cursor-pointer transition-transform hover:scale-110'}`}
          >
            <FiStar
              size={readOnly ? 16 : 24}
              className={`${isFilled ? 'fill-orange-400 text-orange-400' : 'text-gray-300 dark:text-gray-600'}`}
            />
          </button>
        );
      })}
    </div>
  );
}
