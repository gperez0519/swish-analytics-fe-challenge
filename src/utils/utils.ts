import {
  PlayerPropsType,
  AltPropsType,
  FilterPlayerModel,
} from "../types/Types";

export const updatePropsBasedOnMarketRules = (
  playerProps: PlayerPropsType[],
  altPlayerInfo: AltPropsType[]
): PlayerPropsType[] => {
  const playerPropsUpdated = [...playerProps];

  playerPropsUpdated.forEach((player) => {
    const playerOptimalLine = player.line;
    const marketSuspended = player.marketSuspended;

    // If market suspended is false perform the rules check, otherwise leave it as is.
    if (marketSuspended === 0) {
      // Check if optimal link exists in alt players array.
      const currentPlayerAltInfo = altPlayerInfo.find(
        (altPlayer) =>
          altPlayer.line === playerOptimalLine &&
          player.playerId === altPlayer.playerId &&
          player.statTypeId === altPlayer.statTypeId
      );

      // Check if optimal line exists and none of the three probabilities are greater than 40%.
      if (currentPlayerAltInfo) {
        if (
          currentPlayerAltInfo.underOdds < 0.4 &&
          currentPlayerAltInfo.pushOdds < 0.4 &&
          currentPlayerAltInfo.overOdds < 0.4
        ) {
          player.marketSuspended = 1;
        }
      } else {
        player.marketSuspended = 1;
      }
    }
  });

  return [...playerPropsUpdated];
};

export const filterPlayerInfo = (
  playerPropsInfo: PlayerPropsType[],
  filterType: FilterPlayerModel,
  textSearchVal: string,
  setFilteredPlayerPropsInfo: React.Dispatch<
    React.SetStateAction<PlayerPropsType[]>
  >
): void => {
  if (playerPropsInfo.length > 0) {
    if (filterType) {
      // Filter the player info based on the filter type value selected
      let filteredPlayerInfo = playerPropsInfo.filter((player) =>
        player.position.includes(filterType.position) &&
        player.statType.includes(filterType.statType)
          ? true
          : false
      );

      // Filter the player info based on the market suspended.
      if (
        filterType.marketSuspended !== null &&
        filterType.marketSuspended !== ""
      ) {
        filteredPlayerInfo = filteredPlayerInfo.filter((player) => {
          if (
            filterType.marketSuspended === null ||
            filterType.marketSuspended === ""
          ) {
            return false;
          } else {
            if (player.marketSuspended === filterType.marketSuspended) {
              return true;
            } else {
              return false;
            }
          }
        });
      }

      // Filter the player info based on the search text entered.
      if (textSearchVal) {
        filteredPlayerInfo = filteredPlayerInfo.filter(
          (player) =>
            player.playerName
              .toLowerCase()
              .includes(textSearchVal.toLowerCase()) ||
            player.teamNickname
              .toLowerCase()
              .includes(textSearchVal.toLowerCase())
        );
      }

      // Update the filtered player info for the table.
      setFilteredPlayerPropsInfo([...filteredPlayerInfo]);
    } else {
      setFilteredPlayerPropsInfo([...playerPropsInfo]);
    }
  }
};
