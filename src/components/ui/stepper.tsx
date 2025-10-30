
import * as React from "react";
import { cn } from "@/lib/utils";

interface StepperProps {
  steps: string[];
  currentStep: number;
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center justify-center w-full py-4">
      <div className="flex items-center w-full max-w-md">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full text-white transition-colors duration-300",
                  currentStep > index ? "bg-green-500" : currentStep === index ? "bg-blue-500" : "bg-gray-300"
                )}
              >
                {currentStep > index ? "✓" : index + 1}
              </div>
              <div className={cn("mt-2 text-sm", currentStep >= index ? "text-gray-900" : "text-gray-500")}>{step}</div>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-auto border-t-2 transition-all duration-300 ease-in-out mx-4" style={{borderColor: currentStep > index ? '#22c55e' : '#d1d5db'}}/>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
