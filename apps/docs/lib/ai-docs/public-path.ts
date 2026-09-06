import { getPublicPath } from '@ai-toolkit/ai-docs/config';
import { localizeHref } from '@ai-toolkit/ai-docs/localize-href';
import { config } from './config';

export const getLocalizedPath = (lang: string | undefined, path: string) => {
  const defaultLanguage = config.defaultLanguage ?? 'en';
  const localizedPath = localizeHref(
    path,
    lang ?? defaultLanguage,
    defaultLanguage,
  );

  return getPublicPath(localizedPath, config.basePath);
};
