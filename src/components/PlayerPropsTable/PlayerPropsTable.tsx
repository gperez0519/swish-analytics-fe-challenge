import * as React from "react";

// Material UI Components
import SearchOffIcon from "@mui/icons-material/SearchOff";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

// Mock Data
import playerProps from "../../mockData/props.json";
import playerAlternates from "../../mockData/alternates.json";

// Custom Components
import FilterDropDown from "../FilterDropDown/FilterDropDown";

// Types
import { FilterPlayerModel, Option, PlayerPropsType } from "../../types/Types";

// Styles
import "./PlayerPropsTable.css";
import {
  updatePropsBasedOnMarketRules,
  updatePlayerSuspension,
  filterPlayerInfo,
} from "../../utils/utils";

const PlayerPropsTable: React.FC = () => {
  const [playerPropsInfo, setPlayerPropsInfo] =
    React.useState<PlayerPropsType[]>(playerProps);
  const [filteredPlayerPropsInfo, setFilteredPlayerPropsInfo] =
    React.useState<PlayerPropsType[]>(playerProps);
  const [filterType, setFilterType] = React.useState<FilterPlayerModel>({
    position: "",
    statType: "",
    marketSuspended: "",
    playerName: "",
    teamNickname: "",
  });
  const [textSearchVal, setTextSearchVal] = React.useState<string>("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const textSearch = e.target.value;
    setTextSearchVal(textSearch);
  };

  const togglePlayerSuspension = React.useCallback(
    (player: PlayerPropsType) => {
      // Update original player market suspension status
      updatePlayerSuspension(player, playerPropsInfo, setPlayerPropsInfo);

      // Update filtered player market suspension status
      updatePlayerSuspension(
        player,
        filteredPlayerPropsInfo,
        setFilteredPlayerPropsInfo
      );
    },
    [playerPropsInfo, filteredPlayerPropsInfo]
  );

  React.useEffect(() => {
    // Update player props based on market rules upon initial render
    const playerPropsUpdated = updatePropsBasedOnMarketRules(
      playerProps,
      playerAlternates
    );

    if (playerPropsUpdated.length > 0) {
      setPlayerPropsInfo(playerPropsUpdated);
    }
  }, []);

  React.useEffect(() => {
    filterPlayerInfo(
      playerPropsInfo,
      filterType,
      textSearchVal,
      setFilteredPlayerPropsInfo
    );
  }, [filterType, playerPropsInfo, textSearchVal]);

  const positionOptions: Option[] = [
    { label: "PG", value: "PG" },
    { label: "SF", value: "SF" },
    { label: "PF", value: "PF" },
    { label: "SG", value: "SG" },
    { label: "C", value: "C" },
  ];

  const statTypeOptions: Option[] = [
    { label: "assists", value: "assists" },
    { label: "rebounds", value: "rebounds" },
    { label: "points", value: "points" },
    { label: "steals", value: "steals" },
  ];

  const marketSuspendOptions: Option[] = [
    { label: "Yes", value: 1 },
    { label: "No", value: 0 },
  ];

  return (
    <div className="mainPlayerTable">
      <div className="filterContainer">
        <h2>Filters:</h2>
        <FilterDropDown
          labelName="Position"
          keyToFilterBy="position"
          filterOptions={positionOptions}
          setFilterType={setFilterType}
        />
        <FilterDropDown
          labelName="Stat Type"
          keyToFilterBy="statType"
          filterOptions={statTypeOptions}
          setFilterType={setFilterType}
        />
        <FilterDropDown
          labelName="Market Suspended"
          keyToFilterBy="marketSuspended"
          filterOptions={marketSuspendOptions}
          setFilterType={setFilterType}
        />
        <Box
          component="form"
          sx={{
            "& > :not(style)": { m: 1, width: "25ch" },
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            id="mainSearchFilter"
            label="Search..."
            variant="outlined"
            placeholder="Search by Player or Team"
            value={textSearchVal}
            onChange={handleSearch}
          />
        </Box>
      </div>
      <div className="playerPropsTableContainer">
        <table className="playerPropsTable">
          <thead>
            <tr>
              <th>Player Name</th>
              <th align="right">Team Name</th>
              <th align="right">Team Abbr</th>
              <th align="right">Position</th>
              <th align="right">Stat Type</th>
              <th align="right">Line</th>
              <th align="center">Market Suspended</th>
              <th align="right">Low</th>
              <th align="right">High</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlayerPropsInfo.length > 0 &&
              filteredPlayerPropsInfo.map((player, i) => {
                // For each player prop filter the player alt by the playerId and statTypeId
                const playerAltFiltered = playerAlternates.filter(
                  (playerAlt) =>
                    playerAlt.playerId === player.playerId &&
                    playerAlt.statTypeId === player.statTypeId
                );

                // Get the player alt filtered array length to get the high line from last element.
                const playerAltFilteredLength = playerAltFiltered.length;

                let playerLow = null;
                let playerHigh = null;

                if (playerAltFilteredLength > 0) {
                  // Sort from low to high
                  playerAltFiltered.sort((a, b) => a.line - b.line);

                  // // Get the low of the current player prop stat
                  playerLow = playerAltFiltered[0].line;

                  // // Get the high of the current player prop stat.
                  playerHigh =
                    playerAltFiltered[playerAltFilteredLength - 1].line;
                }

                return (
                  <tr key={i}>
                    <td>{player.playerName}</td>
                    <td align="right">{player.teamNickname}</td>
                    <td align="right">{player.teamAbbr}</td>
                    <td align="right">{player.position}</td>
                    <td align="right">{player.statType}</td>
                    <td align="right">{player.line}</td>
                    <td
                      align="center"
                      className={`suspensionCell ${
                        player.marketSuspended === 1
                          ? "suspendedMarket"
                          : "activeMarket"
                      }`}
                    >
                      <div>
                        <button
                          className={`btnMarketSuspend text-white ${
                            player.marketSuspended === 1 ? "success" : "error"
                          }`}
                          onClick={() => togglePlayerSuspension(player)}
                        >
                          {player.marketSuspended === 1
                            ? "Unsuspend"
                            : "Suspend"}
                        </button>
                      </div>
                    </td>
                    <td align="right">{playerLow}</td>
                    <td align="right">{playerHigh}</td>
                  </tr>
                );
              })}
            {filteredPlayerPropsInfo.length === 0 && (
              <tr>
                <td colSpan={9}>
                  <div className="no-results">
                    <div>
                      <SearchOffIcon fontSize="large" color="error" />
                    </div>
                    <div className="no-results-text">No results found!</div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlayerPropsTable;
