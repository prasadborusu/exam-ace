import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useSubjects() {
  return useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      console.log("Fetching subjects... Browser Online:", window.navigator.onLine);
      
      const fetchWithTimeout = async () => {
        const fetchPromise = supabase
          .from("subjects")
          .select("*")
          .order("id");
          
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Supabase request timed out after 10 seconds")), 10000)
        );

        const result = await Promise.race([fetchPromise, timeoutPromise]) as any;
        return result;
      };

      try {
        const { data, error } = await fetchWithTimeout();
        if (error) {
          console.error("Supabase error fetching subjects:", error);
          throw error;
        }
        console.log("Subjects fetched successfully:", data?.length);
        return data;
      } catch (err) {
        console.error("Unexpected error in useSubjects:", err);
        throw err;
      }
    },
    throwOnError: true,
  });
}

export function useModules(subjectId: number) {
  return useQuery({
    queryKey: ["modules", subjectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("modules")
        .select("*")
        .eq("subject_id", subjectId)
        .order("module_number");
      if (error) throw error;
      return data;
    },
    enabled: !!subjectId,
  });
}

export function useSubject(subjectId: number) {
  return useQuery({
    queryKey: ["subject", subjectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subjects")
        .select("*")
        .eq("id", subjectId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!subjectId,
  });
}

export function useModule(moduleId: number) {
  return useQuery({
    queryKey: ["module", moduleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("modules")
        .select("*")
        .eq("id", moduleId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!moduleId,
  });
}

export function useMarksCategories(moduleId: number) {
  return useQuery({
    queryKey: ["marks_categories", moduleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("marks_categories")
        .select("*")
        .eq("module_id", moduleId)
        .order("id");
      if (error) throw error;
      return data;
    },
    enabled: !!moduleId,
  });
}

export function useMarksCategory(marksCategoryId: number) {
  return useQuery({
    queryKey: ["marks_category", marksCategoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("marks_categories")
        .select("*")
        .eq("id", marksCategoryId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!marksCategoryId,
  });
}

export function useQuestions(marksCategoryId: number) {
  return useQuery({
    queryKey: ["questions", marksCategoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .eq("marks_category_id", marksCategoryId)
        .order("id");
      if (error) throw error;
      return data;
    },
    enabled: !!marksCategoryId,
  });
}

import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (question: { 
      marks_category_id: number; 
      subject: string; 
      question: string; 
      answer: string; 
    }) => {
      const { data, error } = await supabase
        .from("questions")
        .insert([question])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["questions", variables.marks_category_id] });
    },
  });
}

