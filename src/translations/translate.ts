import th from './th.ts'
import settings from '../settings.ts'

export default function translate(sourceString: string) {
  const lowerSourceString = sourceString.toLowerCase();
  const thString = th[lowerSourceString];
  if (settings.LANGUAGES?.[0]?.startsWith('th') && thString) {
    return thString;
  } else {
    return sourceString;
  }
}