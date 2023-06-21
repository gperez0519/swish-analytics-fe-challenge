import { PlayerPropsType, AltPropsType } from "../types/Types";

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
