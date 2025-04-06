import th from './th.ts'

function matchNavigatorLanguage(incomingChoices: string[]): string {
    const shortChoices = incomingChoices.map(lang => lang.split('-')[0]);
    const shortenedNav = navigator.languages.map(lang => lang.split('-')[0]);
    const firstMatch = shortenedNav.find(lang => shortChoices.includes(lang));
    return firstMatch ? firstMatch : 'en';
}

export default function translate(sourceString: string) {
  const navigatorLanguage = matchNavigatorLanguage(['en', 'th']);
  const lowerSourceString = sourceString.toLowerCase();
  const thString = th[lowerSourceString];
  if (navigatorLanguage === 'th' && thString) {
    return thString;
  } else {
    return sourceString;
  }
}