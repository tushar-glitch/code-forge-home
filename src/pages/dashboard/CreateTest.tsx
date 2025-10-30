import React, { useState } from "react";
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
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { createTest } from "@/lib/test-management-utils";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import {z} from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { TestEditor } from "@/components/dashboard/TestEditor";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { TemplateSelector } from "@/components/dashboard/TemplateSelector";
import { GitImporter } from "@/components/dashboard/GitImporter";
import { ChallengeSelector } from "@/components/dashboard/ChallengeSelector";
import { api } from "@/lib/api";
import { Stepper } from "@/components/ui/stepper";

const formSchema = z.object({
  test_title: z.string().min(2, {
    message: "Test title must be at least 2 characters.",
  }),
  time_limit: z.string().refine((value) => {
    const num = Number(value);
    return !isNaN(num) && num > 0;
  }, {
    message: "Time limit must be a positive number.",
  }),
  instructions: z.string().min(10, {
    message: "Instructions must be at least 10 characters.",
  }),
});

const CreateTest = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, session } = useAuth();
  const { testId: urlTestId } = useParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [newTestId, setNewTestId] = useState<string | null>(urlTestId || null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customTime, setCustomTime] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<any | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      test_title: "",
      time_limit: "60",
      instructions: "",
    },
  });

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template);
    setSelectedChallenge(null); // Clear selected challenge
    form.setValue('primary_language', template.technology);
  };

  const handleChallengeSelect = (challenge: any) => {
    setSelectedChallenge(challenge);
    setSelectedTemplate(null); // Clear selected template
    form.setValue('primary_language', challenge.technology);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setCurrentStep(1);
  };

  const onSave = async (testConfigs: any) => {
    const values = form.getValues();
    let projectData: any = null;
    if (selectedChallenge) {
      projectData = {
        files_json: selectedChallenge.files_json,
        dependencies: selectedChallenge.dependencies,
        test_files_json: selectedChallenge.test_files_json,
        technology: selectedChallenge.technology,
      };
    } else if (selectedTemplate) {
      projectData = {
        files_json: selectedTemplate.files_json,
        dependencies: selectedTemplate.dependencies,
        test_files_json: selectedTemplate.test_files_json,
        technology: selectedTemplate.technology,
      };
    }

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

      const newTest = await createTest({
        test_title: values.test_title,
        time_limit: parseInt(values.time_limit),
        instructions: values.instructions,
        primary_language: projectData.technology,
        files_json: projectData.files_json,
        dependencies: projectData.dependencies,
        test_files_json: projectData.test_files_json,
        technology: projectData.technology,
        ...(selectedChallenge && { challengeId: selectedChallenge.id }),
        test_configurations: testConfigs,
      });

      if (newTest) {
        toast({
          title: "Test created successfully",
          description: "Redirecting to test details page...",
        });
        navigate(`/dashboard/tests`);
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

  return (
    <DashboardLayout title="Create New Test">
      <div className="container mx-auto py-10">
        <Stepper steps={["Create Test", "Configure Test"]} currentStep={currentStep} />
        {currentStep === 0 && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Create New Test</h1>
            <p className="text-muted-foreground">
              Define the test parameters and instructions for candidates.
            </p>
            <Separator className="my-4" />
          </div>
        )}

        {currentStep === 0 && (
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

              <FormItem>
                <FormLabel>Project Source</FormLabel>
                <Tabs defaultValue="challenge">
                  <TabsList>
                    <TabsTrigger value="challenge">Choose a Challenge</TabsTrigger>
                    <TabsTrigger value="template">Start from a template</TabsTrigger>
                    <TabsTrigger value="git">Import from Git</TabsTrigger>
                  </TabsList>
                  <TabsContent value="challenge">
                    <ChallengeSelector onSelect={handleChallengeSelect} selectedChallengeId={selectedChallenge?.id} />
                  </TabsContent>
                  <TabsContent value="template">
                    <TemplateSelector onSelect={handleTemplateSelect} selectedTemplateId={selectedTemplate?.id} />
                  </TabsContent>
                  <TabsContent value="git">
                    <GitImporter onImport={(id) => { /* TODO: Handle Git import */ }} />
                  </TabsContent>
                </Tabs>
                <FormMessage />
              </FormItem>

              <FormField
                control={form.control}
                name="time_limit"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Time Limit</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => {
                          if (value === "custom") {
                            setCustomTime(true);
                          } else {
                            setCustomTime(false);
                            field.onChange(value);
                          }
                        }}
                        defaultValue={field.value}
                        className="flex items-center space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="30" />
                          </FormControl>
                          <FormLabel className="font-normal">30 min</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="60" />
                          </FormControl>
                          <FormLabel className="font-normal">60 min</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="90" />
                          </FormControl>
                          <FormLabel className="font-normal">90 min</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="custom" />
                          </FormControl>
                          <FormLabel className="font-normal">Custom</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    {customTime && (
                      <FormControl>
                        <Input
                          placeholder="Enter custom time in minutes"
                          type="number"
                          onChange={field.onChange}
                        />
                      </FormControl>
                    )}
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
                  "Next: Configure Test"
                )}
              </Button>
            </form>
          </Form>
        )}
        {currentStep === 1 && (
          <TestEditor onSave={onSave} />
        )}
      </div>
    </DashboardLayout>
  );
};

export default CreateTest;
