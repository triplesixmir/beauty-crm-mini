import {useEffect, useState} from "react";

export function useReviews() {
  const [reviews, setReviews] = useState(() => {
    const stored = localStorage.getItem('reviews');
    return stored ? JSON.parse(stored) : [];
  });
  const [editingReview, setEditingReview] = useState(null);

  useEffect(() => {
    localStorage.setItem("reviews", JSON.stringify(reviews));
  }, [reviews]);

  function chooseEditingReview(review) {
    setEditingReview(review);
  }

  function resetEditingReview() {
    setEditingReview(null);
  }

  function addReview(review) {
    setReviews([...reviews, {...review, id: Date.now()}]);
  }

  function removeReview(id) {
    setReviews(reviews.filter(review => review.id !== id));
  }

  function updateReview(updatedReview) {
    setReviews(reviews.map(review => review.id === updatedReview.id ? updatedReview : review));
  }

  return {
    reviews,
    editingReview,
    addReview,
    removeReview,
    updateReview,
    chooseEditingReview,
    resetEditingReview,
  };
}