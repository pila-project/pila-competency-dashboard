import th from './th.ts';
import settings from '../settings.ts';

export const isLangThai = settings.LANGUAGES?.[0]?.startsWith('th') ?? false;

export default function translate(sourceString: string) {
  if (!isLangThai) {
    return sourceString;
  }
  const lowerSourceString = sourceString.toLowerCase();
  return th[lowerSourceString] ?? sourceString;
}