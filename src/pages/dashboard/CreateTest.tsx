import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { createTest, fetchProjects } from "@/lib/test-management-utils";
import { CodeProject } from "@/lib/test-management-utils";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import {z} from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { TestEditor } from "@/components/dashboard/TestEditor";

const formSchema = z.object({
  test_title: z.string().min(2, {
    message: "Test title must be at least 2 characters.",
  }),
  project_id: z.string().min(1, {
    message: "Please select a project.",
  }),
  time_limit: z.string().refine((value) => {
    const num = Number(value);
    return !isNaN(num) && num > 0;
  }, {
    message: "Time limit must be a positive number.",
  }),
  primary_language: z.string().min(2, {
    message: "Primary language must be at least 2 characters.",
  }),
  instructions: z.string().min(10, {
    message: "Instructions must be at least 10 characters.",
  }),
});

const CreateTest = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { testId } = useParams();

  const [projects, setProjects] = useState<CodeProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      test_title: "",
      project_id: "",
      time_limit: "",
      primary_language: "",
      instructions: "",
    },
  });

  useEffect(() => {
    if (!user) {
      navigate("/signin");
      return;
    }

    const loadProjects = async () => {
      setIsLoading(true);
      try {
        const fetchedProjects = await fetchProjects();
        setProjects(fetchedProjects);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load projects",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, [user, navigate, toast]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      if (!user) {
        toast({
          title: "Authentication required",
          description: "You must be logged in to create a test",
          variant: "destructive"
        });
        return;
      }

      const newTestId = await createTest({
        test_title: values.test_title || '',
        project_id: values.project_id || '',
        time_limit: typeof values.time_limit === 'string' ? parseInt(values.time_limit) : values.time_limit || 0,
        primary_language: values.primary_language || '',
        instructions: values.instructions || '',
        user_id: user.id,
      });

      if (newTestId) {
        navigate(`/dashboard/tests/${newTestId}`);
        toast({
          title: "Test created successfully",
          description: "Redirecting to test details page...",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to create test",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating test:", error);
      toast({
        title: "Error",
        description: "Failed to create test",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create New Test</h1>
        <p className="text-muted-foreground">
          Define the test parameters and instructions for candidates.
        </p>
        <Separator className="my-4" />
      </div>

      <Tabs defaultValue="test-details" className="w-full">
        <TabsList>
          <TabsTrigger value="test-details">Test Details</TabsTrigger>
          <TabsTrigger value="test-config">Test Configuration</TabsTrigger>
        </TabsList>
        <TabsContent value="test-details" className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="test_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Test Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter test title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="project_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a project" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {projects.map((project) => (
                          <SelectItem key={project.id} value={project.id.toString()}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time_limit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Limit (minutes)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter time limit" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="primary_language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Language</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter primary language" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="instructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instructions</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter test instructions for the candidate"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Create Test"
                )}
              </Button>
            </form>
          </Form>
        </TabsContent>
        <TabsContent value="test-config" className="p-4">
          {testId ? (
            <TestEditor testId={parseInt(testId)} />
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              Save the test first to configure test scripts
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreateTest;
