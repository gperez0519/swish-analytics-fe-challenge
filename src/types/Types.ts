import React from "react";

export interface FilterProps {
  labelName: string;
  keyToFilterBy: FilterByKeys;
  playerInfo: PlayerPropsType[];
  setFilterType: React.Dispatch<React.SetStateAction<FilterPlayerModel>>;
}

export interface FilterPlayerModel {
  position: string;
  statType: string;
  marketSuspended: marketSuspendedType;
  playerName: string;
  teamNickname: string;
}

export interface PlayerPropsType {
  playerName: string;
  playerId: number;
  teamId: number;
  teamNickname: string;
  teamAbbr: string;
  statType: string;
  statTypeId: number;
  position: string;
  marketSuspended: number;
  line: number;
}

export interface AltPropsType {
  playerName: string;
  playerId: number;
  statType: string;
  statTypeId: number;
  line: number;
  underOdds: number;
  overOdds: number;
  pushOdds: number;
}

export type FilterByKeys =
  | "position"
  | "statType"
  | "marketSuspended"
  | "playerName"
  | "teamNickname";
type marketSuspendedType = 0 | 1 | "";
