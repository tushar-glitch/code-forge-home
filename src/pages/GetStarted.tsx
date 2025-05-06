
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";

// Fetch companies function
const fetchCompanies = async () => {
  const { data, error } = await supabase
    .from('companies')
    .select('id, name')
    .order('name', { ascending: true });

  if (error) throw error;
  return data;
};

// Define form schema with validation
const formSchema = z.object({
  email: z.string().email("Please enter a valid work email"),
  role: z.string().min(1, "Please select your role"),
  hiringCount: z.coerce.number().int().min(1, "Must be at least 1"),
  companyId: z.string().min(1, "Please select a company"),
  otherCompany: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const GetStarted = () => {
  const { toast: hookToast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOtherCompany, setShowOtherCompany] = useState(false);
  
  // Fetch companies with React Query
  const { data: companies = [], isLoading: isLoadingCompanies } = useQuery({
    queryKey: ['companies'],
    queryFn: fetchCompanies,
  });
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      role: "",
      hiringCount: 1,
      companyId: "",
      otherCompany: "",
    },
  });

  // Handle company selection changes
  const handleCompanyChange = (value: string) => {
    form.setValue("companyId", value);
    setShowOtherCompany(value === "other");
    
    // Clear other company field if not "other"
    if (value !== "other") {
      form.setValue("otherCompany", "");
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      let companyId = data.companyId;
      
      // If "other" is selected, create a new company
      if (data.companyId === "other" && data.otherCompany) {
        const { data: newCompany, error: companyError } = await supabase
          .from("companies")
          .insert({
            name: data.otherCompany,
          })
          .select('id')
          .single();

        if (companyError) throw companyError;
        companyId = newCompany.id.toString();
      }

      // Insert lead data into Supabase
      const { data: leadData, error } = await supabase
        .from("leads")
        .insert({
          email: data.email,
          role: data.role,
          hiring_count: data.hiringCount,
          company_id: data.companyId
        })
        .select('id')
        .single();

      if (error) throw error;

      // Call the edge function to create a user and send email
      const response = await fetch(
        "https://qcxnesarokpcrzkhlqwv.supabase.co/functions/v1/create-recruiter",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: data.email,
            role: data.role,
            hiringCount: data.hiringCount,
            leadId: leadData.id,
            companyId: companyId,
          }),
        }
      );

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Failed to create account");
      }

      // Show success message with Sonner toast (more modern UI)
      toast("Thanks for your interest!", {
        description: "We've created an account for you! Check your email for login details.",
        position: "bottom-right",
      });
      
      // Also show radix toast for accessibility
      hookToast({
        title: "Account created successfully!",
        description: "Please check your email for login details.",
        variant: "default",
      });
      
      // Reset form and redirect to home after 2 seconds
      form.reset();
      setTimeout(() => navigate("/signin"), 2000);
      
    } catch (error) {
      console.error("Error submitting form:", error);
      
      toast("Something went wrong", {
        description: "Please try again later.",
        position: "bottom-right",
      });
      
      hookToast({
        title: "Submission failed",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavBar />
      
      <main className="flex-1 container max-w-5xl mx-auto px-4 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Get started with <span className="gradient-text">hire10xdevs</span>
              </h1>
              <p className="text-muted-foreground text-lg">
                Fill out this form and we'll create an account for you to start using hire10xdevs for your technical assessments.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full mt-1">
                  <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Real-world challenges</h3>
                  <p className="text-sm text-muted-foreground">Evaluate candidates on actual skills, not just algorithms</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full mt-1">
                  <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Reduce interview time</h3>
                  <p className="text-sm text-muted-foreground">Our platform helps you screen candidates more efficiently</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full mt-1">
                  <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">AI-assisted evaluation</h3>
                  <p className="text-sm text-muted-foreground">Get insights on candidate code and performance</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -z-10 inset-0 blur-3xl opacity-20">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/30 rounded-full"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/30 rounded-full"></div>
            </div>
            
            <div className="bg-card border border-border rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Create your account</h2>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Work Email</FormLabel>
                        <FormControl>
                          <Input placeholder="you@company.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="companyId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company</FormLabel>
                        <Select 
                          onValueChange={handleCompanyChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your company" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {isLoadingCompanies ? (
                              <SelectItem value="loading" disabled>Loading...</SelectItem>
                            ) : (
                              <>
                                {companies.map((company) => (
                                  <SelectItem key={company.id} value={company.id.toString()}>
                                    {company.name}
                                  </SelectItem>
                                ))}
                                <SelectItem value="other">Other</SelectItem>
                              </>
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {showOtherCompany && (
                    <FormField
                      control={form.control}
                      name="otherCompany"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your company name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Role</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="talent_acquisition">Talent Acquisition</SelectItem>
                            <SelectItem value="engineering_lead">Engineering Lead</SelectItem>
                            <SelectItem value="developer">Developer</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="hiringCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>How many roles are you hiring for?</FormLabel>
                        <FormControl>
                          <Input type="number" min={1} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default GetStarted;