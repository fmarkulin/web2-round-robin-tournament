declare type Player = {
  id: number;
  name: string;
  points: number;
};

declare type Pair = {
  id: number;
  p1: number | null; // null=bye
  p2: number | null; // null=bye
  winner: 0 | 1 | 2 | null; // 0=draw, 1=player1, 2=player2, null=not played yet
};

declare type Round = {
  id: number;
  pairs: Pair[];
};

declare type PointSystem = {
  win: number;
  draw: number;
  loss: number;
};

declare type Tournament = {
  title: string;
  slug: string;
  userSub: string;
  pointSystem: PointSystem;
  players: Player[];
  rounds: Round[];
  timestamp: number;
};
