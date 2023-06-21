import React from "react";

export interface FilterProps {
  labelName: string;
  keyToFilterBy: FilterByKeys;
  playerInfo: PlayerPropsType[];
  setFilteredPlayerInfo: React.Dispatch<
    React.SetStateAction<PlayerPropsType[]>
  >;
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

export type FilterByKeys = "position" | "statType" | "marketSuspended";
