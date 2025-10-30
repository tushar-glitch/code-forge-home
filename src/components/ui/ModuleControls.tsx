import { Code, Bot, FolderKanban, BarChart, Library, BookOpen, ShieldCheck, Zap } from "lucide-react";

export const ModuleControls = () => {
  return (
    <div className="box-border caret-transparent">
      <h4 className="text-gray-800 text-lg font-semibold box-border caret-transparent leading-7 mb-4">
        Core Features
      </h4>
      <div className="space-y-4">
        <div className="items-center bg-white shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0.05)_0px_1px_2px_0px] box-border caret-transparent flex justify-between border border-gray-200 p-4 rounded-[10.4px] border-solid">
          <div className="items-center box-border caret-transparent gap-x-3 flex basis-[0%] grow gap-y-3">
            <div className="items-center bg-gray-100 box-border caret-transparent flex h-10 justify-center w-10 rounded-full">
              <Code className="h-5 w-5 text-gray-400" />
            </div>
            <div className="box-border caret-transparent basis-[0%] grow">
              <h5 className="text-gray-800 font-medium box-border caret-transparent">
                In-Browser IDE
              </h5>
              <p className="text-gray-500 text-sm box-border caret-transparent leading-5">
                Full-featured development environment
              </p>
            </div>
          </div>
        </div>

        <div className="items-center bg-white shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0.05)_0px_1px_2px_0px] box-border caret-transparent flex justify-between border border-gray-200 p-4 rounded-[10.4px] border-solid">
          <div className="items-center box-border caret-transparent gap-x-3 flex basis-[0%] grow gap-y-3">
            <div className="items-center bg-gray-100 box-border caret-transparent flex h-10 justify-center w-10 rounded-full">
              <Bot className="h-5 w-5 text-gray-400" />
            </div>
            <div className="box-border caret-transparent basis-[0%] grow">
              <h5 className="text-gray-800 font-medium box-border caret-transparent">
                AI Assistant
              </h5>
              <p className="text-gray-500 text-sm box-border caret-transparent leading-5">
                AI-powered guidance for assessments
              </p>
            </div>
          </div>
        </div>

        <div className="items-center bg-white shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0.05)_0px_1px_2px_0px] box-border caret-transparent flex justify-between border border-gray-200 p-4 rounded-[10.4px] border-solid">
          <div className="items-center box-border caret-transparent gap-x-3 flex basis-[0%] grow gap-y-3">
            <div className="items-center bg-gray-100 box-border caret-transparent flex h-10 justify-center w-10 rounded-full">
              <FolderKanban className="h-5 w-5 text-gray-400" />
            </div>
            <div className="box-border caret-transparent basis-[0%] grow">
              <h5 className="text-gray-800 font-medium box-border caret-transparent">
                Project-Based Tests
              </h5>
              <p className="text-gray-500 text-sm box-border caret-transparent leading-5">
                Realistic coding scenarios
              </p>
            </div>
          </div>
        </div>

        <div className="items-center bg-white shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0.05)_0px_1px_2px_0px] box-border caret-transparent flex justify-between border border-gray-200 p-4 rounded-[10.4px] border-solid">
          <div className="items-center box-border caret-transparent gap-x-3 flex basis-[0%] grow gap-y-3">
            <div className="items-center bg-gray-100 box-border caret-transparent flex h-10 justify-center w-10 rounded-full">
              <BarChart className="h-5 w-5 text-gray-400" />
            </div>
            <div className="box-border caret-transparent basis-[0%] grow">
              <h5 className="text-gray-800 font-medium box-border caret-transparent">
                Detailed Analytics
              </h5>
              <p className="text-gray-500 text-sm box-border caret-transparent leading-5">
                Comprehensive metrics on candidate performance
              </p>
            </div>
          </div>
        </div>

        <div className="items-center bg-white shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0.05)_0px_1px_2px_0px] box-border caret-transparent flex justify-between border border-gray-200 p-4 rounded-[10.4px] border-solid">
          <div className="items-center box-border caret-transparent gap-x-3 flex basis-[0%] grow gap-y-3">
            <div className="items-center bg-gray-100 box-border caret-transparent flex h-10 justify-center w-10 rounded-full">
              <Library className="h-5 w-5 text-gray-400" />
            </div>
            <div className="box-border caret-transparent basis-[0%] grow">
              <h5 className="text-gray-800 font-medium box-border caret-transparent">
                Template Library
              </h5>
              <p className="text-gray-500 text-sm box-border caret-transparent leading-5">
                Ready-made assessment templates
              </p>
            </div>
          </div>
        </div>

        <div className="items-center bg-white shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0.05)_0px_1px_2px_0px] box-border caret-transparent flex justify-between border border-gray-200 p-4 rounded-[10.4px] border-solid">
          <div className="items-center box-border caret-transparent gap-x-3 flex basis-[0%] grow gap-y-3">
            <div className="items-center bg-gray-100 box-border caret-transparent flex h-10 justify-center w-10 rounded-full">
              <BookOpen className="h-5 w-5 text-gray-400" />
            </div>
            <div className="box-border caret-transparent basis-[0%] grow">
              <h5 className="text-gray-800 font-medium box-border caret-transparent">
                Documentation Tools
              </h5>
              <p className="text-gray-500 text-sm box-border caret-transparent leading-5">
                Evaluate how candidates read and implement features
              </p>
            </div>
          </div>
        </div>

        <div className="items-center bg-white shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0.05)_0px_1px_2px_0px] box-border caret-transparent flex justify-between border border-gray-200 p-4 rounded-[10.4px] border-solid">
          <div className="items-center box-border caret-transparent gap-x-3 flex basis-[0%] grow gap-y-3">
            <div className="items-center bg-gray-100 box-border caret-transparent flex h-10 justify-center w-10 rounded-full">
              <ShieldCheck className="h-5 w-5 text-gray-400" />
            </div>
            <div className="box-border caret-transparent basis-[0%] grow">
              <h5 className="text-gray-800 font-medium box-border caret-transparent">
                Anti-Cheating Measures
              </h5>
              <p className="text-gray-500 text-sm box-border caret-transparent leading-5">
                Plagiarism detection and session monitoring
              </p>
            </div>
          </div>
        </div>

        <div className="items-center bg-white shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0.05)_0px_1px_2px_0px] box-border caret-transparent flex justify-between border border-gray-200 p-4 rounded-[10.4px] border-solid">
          <div className="items-center box-border caret-transparent gap-x-3 flex basis-[0%] grow gap-y-3">
            <div className="items-center bg-gray-100 box-border caret-transparent flex h-10 justify-center w-10 rounded-full">
              <Zap className="h-5 w-5 text-gray-400" />
            </div>
            <div className="box-border caret-transparent basis-[0%] grow">
              <h5 className="text-gray-800 font-medium box-border caret-transparent">
                Fast Setup
              </h5>
              <p className="text-gray-500 text-sm box-border caret-transparent leading-5">
                Create assessments in minutes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};