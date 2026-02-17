import { useState, useEffect } from "react";
import { getUserRatings, getUserAverageRating } from "../api/ratingApi";
import RatingDisplay from "../components/RatingDisplay";

const UserRatings = () => {
  const [ratings, setRatings] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem(import.meta.env.VITE_USER_ID_KEY);

  useEffect(() => {
    fetchRatings();
  }, []);

  const fetchRatings = async () => {
    try {
      const [ratingsData, avgData] = await Promise.all([
        getUserRatings(userId),
        getUserAverageRating(userId),
      ]);
      setRatings(ratingsData);
      setAvgRating(avgData);
    } catch (error) {
      console.error("Failed to fetch ratings:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Ratings</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">Average Rating</h2>
        <div className="flex items-center gap-2">
          <span className="text-4xl font-bold text-blue-600">{avgRating.toFixed(1)}</span>
          <span className="text-2xl">⭐</span>
          <span className="text-gray-600">({ratings.length} ratings)</span>
        </div>
      </div>

      <div className="space-y-4">
        {ratings.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No ratings yet</p>
        ) : (
          ratings.map((rating) => (
            <RatingDisplay key={rating.id} rating={rating} />
          ))
        )}
      </div>
    </div>
  );
};

export default UserRatings;
