import React from 'react';
import { useParams } from 'react-router-dom';
import { TestEditor } from '@/components/dashboard/TestEditor';

const TestDetails = () => {
  const { testId } = useParams();

  if (!testId) {
    return <div>Invalid test ID</div>;
  }

  return <TestEditor testId={parseInt(testId)} />;
};

export default TestDetails;
