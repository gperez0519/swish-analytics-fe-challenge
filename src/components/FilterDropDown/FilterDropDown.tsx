import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { FilterProps } from "../../types/Types";
import _ from "lodash";

const FilterDropDown: React.FC<FilterProps> = ({
  labelName,
  keyToFilterBy,
  playerInfo,
  setFilteredPlayerInfo,
}) => {
  const [filterType, setFilterType] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    // Capture the filter type value selected.
    const filterTypeSelected = event.target.value;

    if (playerInfo.length > 0) {
      // Filter the player info based on the filter type value selected
      const filteredPlayerInfo = playerInfo.filter(
        (player) => player[keyToFilterBy] === filterTypeSelected
      );

      // Update the filtered player info for the table.
      setFilteredPlayerInfo(filteredPlayerInfo);
    }

    // Set the filter type value selected in the filter drop down.
    setFilterType(event.target.value);
  };

  let playerUniqueFilterTypes = null;

  if (playerInfo.length > 0) {
    playerUniqueFilterTypes = _.uniq(_.map(playerInfo, keyToFilterBy));
    playerUniqueFilterTypes.sort();
    console.log(`Player Unique ${keyToFilterBy}:`, playerUniqueFilterTypes);
  }

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="filterPlayerLabel">{labelName}</InputLabel>
        <Select
          labelId="filterPlayerSelectLabel"
          id="filterPlayerSelect"
          value={filterType}
          onChange={handleChange}
          label={labelName}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {playerUniqueFilterTypes &&
            playerUniqueFilterTypes.map((fltrType, i) => (
              <MenuItem key={i} value={fltrType}>
                {fltrType}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default FilterDropDown;
