import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Template {
  id: string;
  name: string;
  description: string;
  template_language: string;
  technology: string;
}

interface TemplateSelectorProps {
  onSelect: (template: Template) => void;
  selectedTemplateId?: string;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onSelect, selectedTemplateId }) => {
  const { session } = useAuth();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [domain, setDomain] = useState('all');
  const [technology, setTechnology] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchTemplates = async () => {
      if (!session) return;
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (domain !== 'all') params.append('domain', domain);
        if (technology !== 'all') params.append('technology', technology);
        params.append('page', page.toString());

        const { templates: data, totalPages: total } = await api.get<{ templates: Template[], totalPages: number }>(
          `/code-projects/templates?${params.toString()}`,
          session.token
        );
        setTemplates(data);
        setTotalPages(total);
      } catch (error) {
        console.error('Error fetching templates:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTemplates();
  }, [session, domain, technology, page]);

  if (isLoading) {
    return <div>Loading templates...</div>;
  }

  return (
    <div>
      <div className="flex space-x-4 mb-4">
        <Select onValueChange={setDomain} defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Domain" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Domains</SelectItem>
            <SelectItem value="frontend">Frontend</SelectItem>
            <SelectItem value="backend">Backend</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={setTechnology} defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Technology" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Technologies</SelectItem>
            <SelectItem value="react">React</SelectItem>
            <SelectItem value="node">Node.js</SelectItem>
            <SelectItem value="python">Python</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={`cursor-pointer hover:border-primary ${selectedTemplateId === template.id ? 'border-primary' : ''}`}
            onClick={() => onSelect(template)}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {template.name}
                {selectedTemplateId === template.id && <CheckCircle className="text-primary" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{template.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex justify-center items-center space-x-4 mt-4">
        <Button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
        <span>Page {page} of {totalPages}</span>
        <Button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</Button>
      </div>
    </div>
  );
};
