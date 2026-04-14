import { useState, useEffect } from "react";

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<number[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("examace-bookmarks");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("examace-bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  const toggleBookmark = (questionId: number) => {
    setBookmarks((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    );
  };

  const isBookmarked = (questionId: number) => bookmarks.includes(questionId);

  return { bookmarks, toggleBookmark, isBookmarked };
}
