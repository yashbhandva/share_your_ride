const RatingDisplay = ({ rating, showComment = true }) => {
  if (!rating) return null;

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <div className="flex items-center gap-2 mb-2">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <span key={star} className="text-yellow-500">
              {star <= rating.stars ? "⭐" : "☆"}
            </span>
          ))}
        </div>
        <span className="text-gray-600">({rating.stars}/5)</span>
      </div>
      
      {showComment && rating.comment && (
        <p className="text-gray-700 mt-2">{rating.comment}</p>
      )}
      
      <div className="text-sm text-gray-500 mt-2">
        <p>From: {rating.givenByName}</p>
        <p>To: {rating.givenToName}</p>
        <p>{new Date(rating.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default RatingDisplay;
