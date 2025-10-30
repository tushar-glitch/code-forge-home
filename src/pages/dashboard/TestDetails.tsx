import React from 'react';
import { useParams } from 'react-router-dom';
import { TestEditor } from '@/components/dashboard/TestEditor';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const TestDetails = () => {
  const { testId } = useParams();

  if (!testId) {
    return <div>Invalid test ID</div>;
  }

  return (
    <DashboardLayout title="Test Details">
      <TestEditor testId={parseInt(testId)} />
    </DashboardLayout>
  );
};

export default TestDetails;
