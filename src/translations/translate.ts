import th from './th.ts';
import { getLanguage } from '../language.ts';

export function isLangThai() {
  return getLanguage() === 'th';
}

export default function translate(sourceString: string) {
  if (!isLangThai()) {
    return sourceString;
  }
  const lowerSourceString = sourceString.toLowerCase();
  return th[lowerSourceString] ?? sourceString;
}
