import { SpeechModelV2, SpeechModelV3 } from '@ai-toolkit/provider';

/**
Speech model that is used by the AI TOOLKIT.
  */
export type SpeechModel = string | SpeechModelV3 | SpeechModelV2;
