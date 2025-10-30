
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { saveTestConfiguration, getTestConfigurations } from "@/lib/test-management-utils";
import { Loader2, Trash2, PlusCircle, Save } from "lucide-react";

interface TestEditorProps {
  testId?: number;
  onSave: (configs: TestConfig[]) => Promise<void>;
}

interface TestConfig {
  id?: string;
  test_id: number;
  name: string;
  description: string;
  test_script: string;
  enabled: boolean;
}

export function TestEditor({ testId, onSave }: TestEditorProps) {
  const { toast } = useToast();
  const [testConfigs, setTestConfigs] = useState<TestConfig[]>(() => [
    {
      test_id: testId || 0,
      name: "Basic Functionality",
      description: "Tests the basic functionality of the application",
      test_script: `
// Example test script
import { test, expect } from '@playwright/test';

test('App renders without crashing', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();
});
      `.trim(),
      enabled: true
    }
  ]);
  const [isSaving, setIsSaving] = useState(false);

  const handleAddConfig = () => {
    setTestConfigs([
      ...testConfigs,
      {
        test_id: testId,
        name: "New Test",
        description: "",
        test_script: `
// New test script
import { test, expect } from '@playwright/test';

test('New test', async ({ page }) => {
  await page.goto('/');
  // Add your test assertions here
});
        `.trim(),
        enabled: true
      }
    ]);
  };

  const handleRemoveConfig = (index: number) => {
    setTestConfigs(testConfigs.filter((_, i) => i !== index));
  };

  const handleUpdateConfig = (index: number, field: string, value: any) => {
    const updatedConfigs = [...testConfigs];
    updatedConfigs[index] = {
      ...updatedConfigs[index],
      [field]: value
    };
    setTestConfigs(updatedConfigs);
  };

  const handleSaveConfigurations = async () => {
    setIsSaving(true);
    try {
      await onSave(testConfigs);
    } catch (error) {
      console.error("Error saving test configurations:", error);
      toast({
        title: "Error",
        description: "Failed to save test configurations",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Test Configurations</h2>
        <Button onClick={handleAddConfig} variant="outline" className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Add Test
        </Button>
      </div>

      <div className="space-y-6">
        {testConfigs.map((config, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="bg-muted/30">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <Label htmlFor={`test-name-${index}`}>Test Name</Label>
                  <Input
                    id={`test-name-${index}`}
                    value={config.name}
                    onChange={(e) => handleUpdateConfig(index, 'name', e.target.value)}
                    className="max-w-xs"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={config.enabled}
                      onCheckedChange={(checked) => handleUpdateConfig(index, 'enabled', checked)}
                    />
                    <span className="text-sm">
                      {config.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveConfig(index)}
                  >
                    <Trash2 className="h-5 w-5 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label htmlFor={`test-description-${index}`}>Description</Label>
                <Input
                  id={`test-description-${index}`}
                  value={config.description || ''}
                  onChange={(e) => handleUpdateConfig(index, 'description', e.target.value)}
                  placeholder="Describe what this test checks for"
                />
              </div>
              <div>
                <Label htmlFor={`test-script-${index}`}>Test Script (Playwright)</Label>
                <Textarea
                  id={`test-script-${index}`}
                  value={config.test_script}
                  onChange={(e) => handleUpdateConfig(index, 'test_script', e.target.value)}
                  className="font-mono h-64 overflow-auto"
                  placeholder="Write your Playwright test script here"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={handleSaveConfigurations} 
          disabled={isSaving || testConfigs.length === 0}
          className="gap-2"
        >
          {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
          <Save className="h-4 w-4" />
          Save All Tests
        </Button>
      </div>
    </div>
  );
}
