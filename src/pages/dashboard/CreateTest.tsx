
import React, { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, ChevronRight, Code, FileText, Timer } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const templates = [
  {
    id: "react-bug",
    title: "React Bug Fix",
    description: "Find and fix bugs in a React component"
  },
  {
    id: "node-api",
    title: "Node.js API",
    description: "Implement missing endpoints in a Node.js API"
  },
  {
    id: "full-stack",
    title: "Full Stack App",
    description: "Debug a full stack application with React and Node.js"
  },
  {
    id: "algorithm",
    title: "Algorithm Challenge",
    description: "Optimize an inefficient algorithm implementation"
  }
];

const formSteps = ["Choose Template", "Configure Test", "Review & Publish"];

const CreateTest: React.FC = () => {
  const [step, setStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    timeLimit: 60,
    language: "javascript",
    instructions: ""
  });

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step === 0 && !selectedTemplate) {
      toast({
        title: "Please select a template",
        description: "You need to select a template to continue.",
        variant: "destructive"
      });
      return;
    }
    
    if (step === 1 && (!formData.title || !formData.instructions)) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields before continuing.",
        variant: "destructive"
      });
      return;
    }
    
    if (step < formSteps.length - 1) {
      setStep(step + 1);
    } else {
      // Submit form
      toast({
        title: "Test created successfully!",
        description: "Your new test has been published.",
      });
      // Reset form and redirect to tests page
      setStep(0);
      setSelectedTemplate("");
      setFormData({
        title: "",
        timeLimit: 60,
        language: "javascript",
        instructions: ""
      });
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <DashboardLayout title="Create Test">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Progress Steps */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="relative flex justify-between">
            {formSteps.map((formStep, i) => (
              <div key={i} className="flex flex-col items-center">
                <div 
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                    step >= i 
                      ? "border-primary bg-primary text-white" 
                      : "border-muted-foreground text-muted-foreground"
                  }`}
                >
                  {step > i ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    i + 1
                  )}
                </div>
                <span 
                  className={`mt-2 text-xs ${
                    step >= i ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {formStep}
                </span>
              </div>
            ))}
            <div className="absolute left-0 top-4 -z-10 h-0.5 w-full bg-muted">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${(step / (formSteps.length - 1)) * 100}%` }}
              />
            </div>
          </div>
        </motion.div>

        {/* Step 1: Choose Template */}
        {step === 0 && (
          <motion.div variants={itemVariants}>
            <h2 className="mb-4 text-xl font-semibold">Choose a Test Template</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {templates.map((template) => (
                <Card 
                  key={template.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedTemplate === template.id ? "border-2 border-primary" : ""
                  }`}
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <CardHeader className="flex flex-row items-start justify-between">
                    <div>
                      <CardTitle>{template.title}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </div>
                    {template.id === "react-bug" && <Code className="h-5 w-5 text-primary" />}
                    {template.id === "node-api" && <FileText className="h-5 w-5 text-primary" />}
                    {template.id === "full-stack" && <Code className="h-5 w-5 text-primary" />}
                    {template.id === "algorithm" && <Timer className="h-5 w-5 text-primary" />}
                  </CardHeader>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2: Configure Test */}
        {step === 1 && (
          <motion.div 
            variants={itemVariants}
            initial="hidden"
            animate="visible" 
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Configure Test Settings</CardTitle>
                <CardDescription>
                  Set up the details for your test
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Test Title</Label>
                  <Input 
                    id="title" 
                    name="title"
                    placeholder="Frontend React Component Bug Fix"
                    value={formData.title}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                    <Input 
                      id="timeLimit" 
                      name="timeLimit"
                      type="number" 
                      value={formData.timeLimit}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="language">Primary Language</Label>
                    <select 
                      id="language" 
                      name="language"
                      value={formData.language}
                      onChange={handleInputChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="javascript">JavaScript</option>
                      <option value="typescript">TypeScript</option>
                      <option value="python">Python</option>
                      <option value="java">Java</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="instructions">Instructions</Label>
                  <Textarea 
                    id="instructions" 
                    name="instructions"
                    placeholder="Enter detailed instructions for the candidate..."
                    rows={6}
                    value={formData.instructions}
                    onChange={handleInputChange}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 3: Review & Publish */}
        {step === 2 && (
          <motion.div 
            variants={itemVariants}
            initial="hidden"
            animate="visible" 
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Review Test</CardTitle>
                <CardDescription>
                  Review your test details before publishing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md bg-muted p-4">
                  <div className="grid gap-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Template</span>
                      <span className="text-sm">
                        {templates.find(t => t.id === selectedTemplate)?.title}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Title</span>
                      <span className="text-sm">{formData.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Time Limit</span>
                      <span className="text-sm">{formData.timeLimit} minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Language</span>
                      <span className="text-sm">{formData.language}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Instructions</h3>
                  <div className="rounded-md bg-muted p-4">
                    <p className="text-sm whitespace-pre-line">{formData.instructions}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 0}
          >
            Back
          </Button>
          <Button onClick={handleNext} className="flex items-center gap-2">
            {step === formSteps.length - 1 ? "Publish Test" : "Continue"}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default CreateTest;
