import settings from './settings.ts';

export function getLanguage() {
  const language = settings.FORCED_LANGUAGE || settings.LANGUAGES?.[0] || 'en';
  return language.split('-')[0]?.toLowerCase() || 'en';
}
