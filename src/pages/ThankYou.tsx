import React from 'react';

const ThankYou: React.FC = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Thank You!</h1>
        <p className="text-muted-foreground">Your test has been submitted successfully.</p>
      </div>
    </div>
  );
};

export default ThankYou;
