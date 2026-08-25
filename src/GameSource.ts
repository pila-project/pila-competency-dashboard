export type GameSource =
  | {
      kind: 'game';
      gameId: string;
    }
  | {
      kind: 'customized-game';
      configurationId: string;
    };

export type GameAndName = {
  competencyStateId: string;
  gameId: string;
  name: string;
};
