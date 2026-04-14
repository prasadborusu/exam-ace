import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { 
  useSubjects, 
  useModules, 
  useCreateQuestion 
} from "@/hooks/use-supabase-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Image as ImageIcon, X, UploadCloud } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
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

const formSchema = z.object({
  subjectId: z.string().min(1, "Please select a subject"),
  moduleId: z.string().min(1, "Please select a module"),
  marksType: z.string().min(1, "Please select a marks type"),
  question: z.string().min(10, "Question must be at least 10 characters"),
  answer: z.string().min(10, "Answer must be at least 10 characters"),
});

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function SecurityGate({ onAuthorized }: { onAuthorized: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "1212") {
      sessionStorage.setItem("examace_admin_access", "true");
      onAuthorized();
    } else {
      setError(true);
      toast.error("Invalid password!");
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <Card className="w-full max-w-md glass-card border-border/50">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 glow-primary">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-gradient">Secret Access Required</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Enter Admin Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`bg-background/50 ${error ? "border-destructive animate-shake" : ""}`}
                autoFocus
              />
            </div>
            <Button type="submit" className="w-full">
              Unlock Dashboard
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function AdminPage() {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const isAdmin = sessionStorage.getItem("examace_admin_access") === "true";
    setIsAuthorized(isAdmin);
  }, []);

  if (isAuthorized === null) return null; // Loading state to prevent flash

  if (isAuthorized === false) {
    return <SecurityGate onAuthorized={() => setIsAuthorized(true)} />;
  }

  return <AdminDashboard />;
}

function AdminDashboard() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const { data: subjects, isLoading: loadingSubjects } = useSubjects();
  const createQuestion = useCreateQuestion();

  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subjectId: "",
      moduleId: "",
      marksType: "2 Marks",
      question: "",
      answer: "",
    },
  });

  const selectedSubjectId = form.watch("subjectId");
  const selectedModuleId = form.watch("moduleId");

  const { data: modules, isLoading: loadingModules } = useModules(
    selectedSubjectId ? parseInt(selectedSubjectId) : 0
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size must be less than 2MB");
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const subjectName = subjects?.find((s: any) => s.id.toString() === values.subjectId)?.name || "";
    setIsUploading(true);
    
    try {
      let imageUrl = "";

      if (selectedImage) {
        const fileExt = selectedImage.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('question-images')
          .upload(filePath, selectedImage);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('question-images')
          .getPublicUrl(filePath);
          
        imageUrl = publicUrl;
      }

      await createQuestion.mutateAsync({
        module_id: parseInt(values.moduleId),
        marks_type: values.marksType,
        subject: subjectName,
        question: values.question,
        answer: values.answer,
        image_url: imageUrl,
      });
      
      toast.success("Question added successfully!");
      form.reset({
        ...values,
        question: "",
        answer: "",
      });
      clearImage();
    } catch (error) {
      toast.error("Failed to add question. Please try again.");
      console.error(error);
    } finally {
      setIsUploading(false);
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
                          form.setValue("marksType", "");
                        }} 
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-background/50">
                            <SelectValue placeholder={loadingSubjects ? "Loading..." : "Select Subject"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {subjects?.map((subject: { id: number; name: string }) => (
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
                          form.setValue("marksType", "2 Marks");
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
                          {modules?.map((module: any) => (
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

              {/* Marks Type Select */}
              <FormField
                control={form.control}
                name="marksType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marks Category</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-background/50">
                          <SelectValue placeholder="Select Marks Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="2 Marks">2 Marks</SelectItem>
                        <SelectItem value="8 Marks">8 Marks</SelectItem>
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

              {/* Image Upload */}
              <div className="space-y-2">
                <FormLabel>Answer Image (Optional Diagram)</FormLabel>
                <div className="flex flex-col gap-4">
                  {imagePreview ? (
                    <div className="relative aspect-video rounded-xl overflow-hidden border border-border/50 group">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-contain bg-secondary/30" />
                      <button 
                        type="button" 
                        onClick={clearImage}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-32 w-full rounded-xl border-2 border-dashed border-border/50 bg-secondary/20 hover:bg-secondary/30 transition-colors cursor-pointer group">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadCloud className="w-8 h-8 mb-3 text-muted-foreground group-hover:text-primary transition-colors" />
                        <p className="mb-2 text-sm text-muted-foreground">
                          <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">PNG, JPG or GIF (MAX. 2MB)</p>
                      </div>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  )}
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full relative overflow-hidden group py-6"
                disabled={createQuestion.isPending || isUploading}
              >
                <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/30 transition-colors" />
                {createQuestion.isPending || isUploading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    <span>Add Question with Diagram</span>
                  </div>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
