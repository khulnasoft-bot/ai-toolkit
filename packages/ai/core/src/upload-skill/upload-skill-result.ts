import type {
  SharedV4Warning,
  SkillsV4UploadSkillResult,
} from '@ai-toolkit/provider';
import type { ProviderReference } from '../types/provider-reference';

export type UploadSkillResult = Omit<
  SkillsV4UploadSkillResult,
  'providerReference' | 'warnings'
> & {
  readonly providerReference: ProviderReference;
  readonly warnings: SharedV4Warning[];
};
