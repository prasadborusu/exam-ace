import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { 
  useSubjects, 
  useModules, 
  useMarksCategories, 
  useCreateQuestion 
} from "@/hooks/use-supabase-data";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, PlusCircle } from "lucide-react";

const formSchema = z.zod.object({
  subjectId: z.zod.string().min(1, "Please select a subject"),
  moduleId: z.zod.string().min(1, "Please select a module"),
  marksCategoryId: z.zod.string().min(1, "Please select a category"),
  question: z.zod.string().min(10, "Question must be at least 10 characters"),
  answer: z.zod.string().min(10, "Answer must be at least 10 characters"),
});

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  const { data: subjects, isLoading: loadingSubjects } = useSubjects();
  const createQuestion = useCreateQuestion();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subjectId: "",
      moduleId: "",
      marksCategoryId: "",
      question: "",
      answer: "",
    },
  });

  const selectedSubjectId = form.watch("subjectId");
  const selectedModuleId = form.watch("moduleId");

  const { data: modules, isLoading: loadingModules } = useModules(
    selectedSubjectId ? parseInt(selectedSubjectId) : 0
  );
  
  const { data: categories, isLoading: loadingCategories } = useMarksCategories(
    selectedModuleId ? parseInt(selectedModuleId) : 0
  );

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const subjectName = subjects?.find(s => s.id.toString() === values.subjectId)?.name || "";
    
    try {
      await createQuestion.mutateAsync({
        marks_category_id: parseInt(values.marksCategoryId),
        subject: subjectName,
        question: values.question,
        answer: values.answer,
      });
      
      toast.success("Question added successfully!");
      form.reset({
        ...values,
        question: "",
        answer: "",
      });
    } catch (error) {
      toast.error("Failed to add question. Please try again.");
      console.error(error);
    }
  }

  return (
    <div className="container mx-auto max-w-3xl py-10 px-4">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gradient">Admin Dashboard</h1>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 glow-primary">
          <PlusCircle className="h-6 w-6 text-primary" />
        </div>
      </div>

      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle>Add New Question</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Subject Select */}
                <FormField
                  control={form.control}
                  name="subjectId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <Select 
                        onValueChange={(val) => {
                          field.onChange(val);
                          form.setValue("moduleId", "");
                          form.setValue("marksCategoryId", "");
                        }} 
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-background/50">
                            <SelectValue placeholder={loadingSubjects ? "Loading..." : "Select Subject"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {subjects?.map((subject) => (
                            <SelectItem key={subject.id} value={subject.id.toString()}>
                              {subject.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Module Select */}
                <FormField
                  control={form.control}
                  name="moduleId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Module</FormLabel>
                      <Select 
                        onValueChange={(val) => {
                          field.onChange(val);
                          form.setValue("marksCategoryId", "");
                        }}
                        disabled={!selectedSubjectId || loadingModules}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-background/50">
                            <SelectValue placeholder={!selectedSubjectId ? "Select subject first" : loadingModules ? "Loading..." : "Select Module"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {modules?.map((module) => (
                            <SelectItem key={module.id} value={module.id.toString()}>
                              Module {module.module_number}: {module.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Category Select */}
              <FormField
                control={form.control}
                name="marksCategoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marks Category</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      disabled={!selectedModuleId || loadingCategories}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-background/50">
                          <SelectValue placeholder={!selectedModuleId ? "Select module first" : loadingCategories ? "Loading..." : "Select Category"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories?.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.marks_type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Question Textarea */}
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter the question here..." 
                        className="min-h-[100px] bg-background/50"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Answer Textarea */}
              <FormField
                control={form.control}
                name="answer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Answer</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter the detailed answer here..." 
                        className="min-h-[150px] bg-background/50"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full relative overflow-hidden group py-6"
                disabled={createQuestion.isPending}
              >
                <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/30 transition-colors" />
                {createQuestion.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Add Question"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
