import * as React from "react";

// Material UI Components
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

// Mock Data
import playerProps from "../../mockData/props.json";
import playerAlternates from "../../mockData/alternates.json";

// Custom Components
import FilterDropDown from "../FilterDropDown/FilterDropDown";

// Types
import { FilterPlayerModel, PlayerPropsType } from "../../types/Types";

// Styles
import "./PlayerPropsTable.css";
import {
  updatePropsBasedOnMarketRules,
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

  const updatePlayerSuspension = (playerInfo: PlayerPropsType) => {
    // Update original player info based on new market toggle state
    const updateOriginalPlayerInfo = playerPropsInfo.map((player) => {
      if (
        player.playerId === playerInfo.playerId &&
        player.statTypeId === playerInfo.statTypeId
      ) {
        return {
          ...player,
          marketSuspended: player.marketSuspended === 0 ? 1 : 0,
        };
      }
      return { ...player };
    });

    setPlayerPropsInfo([...updateOriginalPlayerInfo]);
    setFilteredPlayerPropsInfo([...updateOriginalPlayerInfo]);
  };

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
  }, [filterType, filterPlayerInfo, playerPropsInfo, textSearchVal]);

  return (
    <Container maxWidth="lg" className="mainPlayerTable">
      <div className="filterContainer">
        <h2>Filters:</h2>
        <FilterDropDown
          labelName="Position"
          keyToFilterBy="position"
          playerInfo={playerPropsInfo}
          setFilterType={setFilterType}
        />
        <FilterDropDown
          labelName="Stat Type"
          keyToFilterBy="statType"
          playerInfo={playerPropsInfo}
          setFilterType={setFilterType}
        />
        <FilterDropDown
          labelName="Market Suspended"
          keyToFilterBy="marketSuspended"
          playerInfo={playerPropsInfo}
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
            value={textSearchVal}
            onChange={handleSearch}
          />
        </Box>
      </div>
      <TableContainer component={Paper} className="playerPropsTable">
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Player Name</TableCell>
              <TableCell align="right">Team Name</TableCell>
              <TableCell align="right">Team Abbr</TableCell>
              <TableCell align="right">Position</TableCell>
              <TableCell align="right">Stat Type</TableCell>
              <TableCell align="right">Line</TableCell>
              <TableCell align="center">Market Suspended</TableCell>
              <TableCell align="right">Low</TableCell>
              <TableCell align="right">High</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
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
                  <TableRow
                    key={i}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {player.playerName}
                    </TableCell>
                    <TableCell align="right">{player.teamNickname}</TableCell>
                    <TableCell align="right">{player.teamAbbr}</TableCell>
                    <TableCell align="right">{player.position}</TableCell>
                    <TableCell align="right">{player.statType}</TableCell>
                    <TableCell align="right">{player.line}</TableCell>
                    <TableCell
                      align="center"
                      className={`suspensionCell ${
                        player.marketSuspended === 1
                          ? "suspendedMarket"
                          : "activeMarket"
                      }`}
                    >
                      {player.marketSuspended === 1 ? (
                        <div>
                          <span className="marketSuspStatus">Suspended</span>
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
                            onClick={() => updatePlayerSuspension(player)}
                          >
                            Unsuspend
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <span className="marketSuspStatus">Unsuspended</span>
                          <Button
                            size="small"
                            variant="contained"
                            color="error"
                            onClick={() => updatePlayerSuspension(player)}
                          >
                            Suspend
                          </Button>
                        </div>
                      )}
                    </TableCell>
                    <TableCell align="right">{playerLow}</TableCell>
                    <TableCell align="right">{playerHigh}</TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default PlayerPropsTable;
