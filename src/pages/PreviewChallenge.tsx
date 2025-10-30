
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import sdk from '@stackblitz/sdk';

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

const PreviewChallenge = () => {
  const { id } = useParams<{ id: string }>();
  const { session } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChallengeAndEmbed = async () => {
      if (!session) {
        setIsLoading(false);
        setError('You must be logged in to preview challenges.');
        return;
      }

      try {
        const challenge = await api.get(`/challenges/${id}`, session.token);

        sdk.embedProject(
          'stackblitz-embed',
          {
            title: challenge.title,
            description: challenge.description,
            template: getStackBlitzTemplate(challenge.technology),
            files: challenge.files_json,
          },
          {
            openFile: 'src/App.js',
            view: 'preview',
            height: '100%',
            width: '100%',
          }
        );
      } catch (err) {
        setError('Failed to load challenge.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChallengeAndEmbed();
  }, [id, session]);

  if (isLoading) {
    return <div>Loading challenge preview...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return <div id="stackblitz-embed" style={{ height: '100vh', width: '100%' }}></div>;
};

export default PreviewChallenge;
