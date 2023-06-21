import React from "react";

export interface FilterProps {
  labelName: string;
  keyToFilterBy: FilterByKeys;
  playerInfo: PlayerPropsType[];
  filterPlayerInfo: () => void;
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

export type FilterByKeys =
  | "position"
  | "statType"
  | "marketSuspended"
  | "playerName"
  | "teamNickname";
type marketSuspendedType = 0 | 1 | "";
