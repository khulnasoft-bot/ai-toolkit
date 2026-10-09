'use client';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { aiProviders } from '@/lib/providers';

interface ProviderSelectorProps {
  selectedProvider: string;
  selectedModel: string;
  onProviderChange: (providerId: string) => void;
  onModelChange: (modelId: string) => void;
}

export function ProviderSelector({
  selectedProvider,
  selectedModel,
  onProviderChange,
  onModelChange,
}: ProviderSelectorProps) {
  const [isProviderOpen, setIsProviderOpen] = useState(false);
  const [isModelOpen, setIsModelOpen] = useState(false);

  const currentProvider = aiProviders.find(p => p.id === selectedProvider);
  const currentModels = currentProvider?.models || [];

  return (
    <div className="space-y-4">
      <div className="relative">
        <label className="text-sm font-medium">AI Provider</label>
        <Button
          variant="outline"
          onClick={() => setIsProviderOpen(!isProviderOpen)}
          className="w-full justify-between mt-1"
        >
          {currentProvider?.name || 'Select Provider'}
          <ChevronDown className="h-4 w-4" />
        </Button>

        {isProviderOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
            {aiProviders.map(provider => (
              <button
                type="button"
                key={provider.id}
                onClick={() => {
                  onProviderChange(provider.id);
                  onModelChange(provider.models[0]);
                  setIsProviderOpen(false);
                }}
                className={`w-full text-left px-3 py-2 hover:bg-accent text-sm ${
                  provider.id === selectedProvider ? 'bg-accent' : ''
                }`}
              >
                {provider.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="relative">
        <label className="text-sm font-medium">Model</label>
        <Button
          variant="outline"
          onClick={() => setIsModelOpen(!isModelOpen)}
          className="w-full justify-between mt-1"
          disabled={!currentProvider}
        >
          {selectedModel || 'Select Model'}
          <ChevronDown className="h-4 w-4" />
        </Button>

        {isModelOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
            {currentModels.map(model => (
              <button
                type="button"
                key={model}
                onClick={() => {
                  onModelChange(model);
                  setIsModelOpen(false);
                }}
                className={`w-full text-left px-3 py-2 hover:bg-accent text-sm ${
                  model === selectedModel ? 'bg-accent' : ''
                }`}
              >
                {model}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
