'use client'

import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { useState } from 'react'

interface SettingsPanelProps {
  temperature: number
  maxTokens: number
  topP: number
  onTemperatureChange: (value: number) => void
  onMaxTokensChange: (value: number) => void
  onTopPChange: (value: number) => void
}

export function SettingsPanel({
  temperature,
  maxTokens,
  topP,
  onTemperatureChange,
  onMaxTokensChange,
  onTopPChange,
}: SettingsPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Parameters</CardTitle>
      </CardHeader>
      <div className="px-6 pb-6 space-y-6">
        {/* Temperature */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-foreground">Temperature</label>
            <span className="text-sm text-muted-foreground">{temperature.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={temperature}
            onChange={(e) => onTemperatureChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-input-bg rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Controls randomness: lower is focused, higher is creative
          </p>
        </div>

        {/* Max Tokens */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-foreground">Max Tokens</label>
            <span className="text-sm text-muted-foreground">{maxTokens}</span>
          </div>
          <input
            type="range"
            min="100"
            max="4000"
            step="100"
            value={maxTokens}
            onChange={(e) => onMaxTokensChange(parseInt(e.target.value))}
            className="w-full h-2 bg-input-bg rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Maximum length of the response
          </p>
        </div>

        {/* Top P */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-foreground">Top P</label>
            <span className="text-sm text-muted-foreground">{topP.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={topP}
            onChange={(e) => onTopPChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-input-bg rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Controls diversity via nucleus sampling
          </p>
        </div>
      </div>
    </Card>
  )
}
