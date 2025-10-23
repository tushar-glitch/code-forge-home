
import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import sdk from '@stackblitz/sdk';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  tags: string[];
  project_id: string;
}

interface ChallengeSelectorProps {
  onSelect: (challenge: Challenge) => void;
  selectedChallengeId?: string;
}

const getStackBlitzTemplate = (technology: string) => {
  switch (technology) {
    case 'react':
      return 'create-react-app';
    case 'node':
      return 'node';
    case 'python':
      return 'python';
    case 'javascript':
      return 'javascript';
    case 'typescript':
      return 'typescript';
    case 'vue':
      return 'vue';
    case 'angular':
      return 'angular-cli';
    default:
      return 'javascript';
  }
};

export const ChallengeSelector: React.FC<ChallengeSelectorProps> = ({ onSelect, selectedChallengeId }) => {
  const { session } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [domain, setDomain] = useState('all');
  const [technology, setTechnology] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchChallenges = async () => {
      if (!session) return;
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (domain !== 'all') params.append('domain', domain);
        if (technology !== 'all') params.append('technology', technology);
        params.append('page', page.toString());

        const { challenges: data, totalPages: total } = await api.get<{ challenges: Challenge[], totalPages: number }>(
          `/challenges?${params.toString()}`,
          session.token
        );
        setChallenges(data);
        setTotalPages(total);
      } catch (error) {
        console.error('Error fetching challenges:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChallenges();
  }, [session, domain, technology, page]);

  const handlePreview = (challenge: Challenge) => {
    window.open(`/preview/project/${challenge.project_id}`, '_blank');
  };

  if (isLoading) {
    return <div>Loading challenges...</div>;
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
        {challenges.map((challenge) => (
          <Card
            key={challenge.id}
            className={`cursor-pointer hover:border-primary ${selectedChallengeId === challenge.id ? 'border-primary' : ''}`}
            onClick={() => onSelect(challenge)}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {challenge.title}
                {selectedChallengeId === challenge.id && <CheckCircle className="text-primary" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{challenge.description}</p>
              <div className="flex justify-between items-center mt-4">
                <div>
                  <span className="text-sm font-medium">{challenge.difficulty}</span>
                </div>
                <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handlePreview(challenge); }}>Preview</Button>
              </div>
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
