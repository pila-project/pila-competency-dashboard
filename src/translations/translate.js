import th from './th.js'

function matchNavigatorLanguage(incomingChoices) {
    const shortChoices = incomingChoices.map(lang => lang.split('-')[0])
    const shortenedNav = navigator.languages.map(lang => lang.split('-')[0])
    const firstMatch = shortenedNav.find(lang => shortChoices.includes(lang))
    return firstMatch ? firstMatch : 'en'
}

export default function translate(sourceString) {
  const navigatorLanguage = matchNavigatorLanguage(['en', 'th'])
  if (navigatorLanguage === 'th' && th[sourceString.toLowerCase()]) {
    return th[sourceString.toLowerCase()]
  }
  else return sourceString
}