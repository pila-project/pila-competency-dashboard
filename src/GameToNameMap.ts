type LocalizedGameName = Readonly<{
  en: string;
  th: string;
}>;

export const gameNameRegistry: Readonly<Record<string, LocalizedGameName>> = {
  '25a6ac35e1c25713b5fedd0008599a52': {
    en: "Chirpy's Adventure",
    th: 'การผจญภัยของเชิร์พปี้',
  },
  'a3db61211b505754aa157cf892648d8f': {
    en: 'Save our Oceans (difficult)',
    th: 'อนุรักษ์ท้องทะเล (ระดับกลาง)',
  },
  '27d432ad29ad5e2c8d1c8ebf60d48c0a': {
    en: 'Magical Mixology (difficult)',
    th: 'ศาสตร์แห่งการปรุงน้ำเวทมหัศจรรย์',
  },
  '166d275fa3c557af8d7a65bf25d09765': {
    en: 'Save Our Oceans (easy)',
    th: 'อนุรักษ์ท้องทะเล (ระดับง่าย)',
  },
  '3689b9aac42e5a4cb5f048e89cdbf80a': {
    en: 'Math Invaders',
    th: 'คณิตพิชิตเอเลี่ยน',
  },
  '97c9ab96e9c75cd485d50d0c51fa7004': {
    en: 'Pethematicians!',
    th: 'เพื่อนคู่คิดคณิตศาสตร์!',
  },
  'incredible_machine0': {
    en: 'Incredible Machines (tutorial)!',
    th: 'เครื่องจักรมหัศจรรย์ (บทช่วยสอน)!',
  },
  'incredible_machine1': {
    en: 'Incredible Machines (level 1)!',
    th: 'เครื่องจักรมหัศจรรย์ (ด่าน 1)!',
  },
  'incredible_machine2': {
    en: 'Incredible Machines (level 2)!',
    th: 'เครื่องจักรมหัศจรรย์ (ด่าน 2)!',
  },
  'candli_editor/incredible_machine0': {
    en: 'Incredible Machines (tutorial)!',
    th: 'เครื่องจักรมหัศจรรย์ (บทช่วยสอน)!',
  },
  'candli_editor/incredible_machine1': {
    en: 'Incredible Machines (level 1)!',
    th: 'เครื่องจักรมหัศจรรย์ (ด่าน 1)!',
  },
  'candli_editor/incredible_machine2': {
    en: 'Incredible Machines (level 2)!',
    th: 'เครื่องจักรมหัศจรรย์ (ด่าน 2)!',
  },
};

export function gameToNameMap(gameId: string, language: string) {
  const names = gameNameRegistry[gameId];
  if (names === undefined) {
    return undefined;
  }
  return language === 'th' ? names.th : names.en;
}
