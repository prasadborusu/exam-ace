import { useState, useEffect } from "react";

export function useProgress() {
  const [readQuestions, setReadQuestions] = useState<number[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("examace-progress");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("examace-progress", JSON.stringify(readQuestions));
  }, [readQuestions]);

  const markAsRead = (questionId: number) => {
    setReadQuestions((prev) =>
      prev.includes(questionId) ? prev : [...prev, questionId]
    );
  };

  const isRead = (questionId: number) => readQuestions.includes(questionId);

  const getProgress = (questionIds: number[]) => {
    const read = questionIds.filter((id) => readQuestions.includes(id)).length;
    return { read, total: questionIds.length };
  };

  return { readQuestions, markAsRead, isRead, getProgress };
}
