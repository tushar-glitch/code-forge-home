import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  git_url: z.string().url({ message: 'Please enter a valid Git repository URL.' }),
});

interface GitImporterProps {
  onImport: (projectId: string) => void;
}

export const GitImporter: React.FC<GitImporterProps> = ({ onImport }) => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [isImporting, setIsImporting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      git_url: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!session) return;
    setIsImporting(true);
    try {
      const newProject = await api.post<any>('/code-projects/from-git', { git_url: values.git_url }, session.token);
      onImport(newProject.id);
      toast({
        title: 'Import Successful',
        description: 'Your project has been imported.',
      });
    } catch (error) {
      console.error('Error importing project:', error);
      toast({
        title: 'Import Failed',
        description: 'Could not import the project from the provided URL.',
        variant: 'destructive',
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="git_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Git Repository URL</FormLabel>
              <FormControl>
                <Input placeholder="https://github.com/user/repo.git" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isImporting}>
          {isImporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Importing...
            </>
          ) : (
            'Import Project'
          )}
        </Button>
      </form>
    </Form>
  );
};
