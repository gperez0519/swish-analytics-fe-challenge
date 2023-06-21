import * as React from "react";

// Material UI components
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

// Types
import { FilterProps } from "../../types/Types";

// Utils
import _ from "lodash";

const FilterDropDown: React.FC<FilterProps> = ({
  labelName,
  keyToFilterBy,
  playerInfo,
  setFilterType,
}) => {
  const [selectedValue, setSelectedValue] = React.useState<string>("");
  const [uniqueFilterTypes, setUniqueFilterTypes] = React.useState<
    (string | number)[]
  >([]);

  const handleChange = (event: SelectChangeEvent) => {
    // Capture the filter type value selected.
    const filterTypeSelected = event.target.value;

    // Update the key in context with value of the filter selected.
    if (keyToFilterBy) {
      setFilterType((prevFilterTypes) => ({
        ...prevFilterTypes,
        [keyToFilterBy]: filterTypeSelected,
      }));
    }

    // Set the filter type value selected in the filter drop down.
    setSelectedValue(event.target.value);
  };

  React.useEffect(() => {
    let playerUniqueFilterTypes: (string | number)[] = [];

    if (playerInfo.length > 0) {
      // Set the unique filter value based on the type in context; Ex: position, stat type, market status, etc.
      playerUniqueFilterTypes = _.uniq(_.map(playerInfo, keyToFilterBy));

      if (playerUniqueFilterTypes) {
        // Set the unique values by ascending order.
        playerUniqueFilterTypes.sort();

        setUniqueFilterTypes(playerUniqueFilterTypes);
      }
    }
  }, [keyToFilterBy, playerInfo]);

  return (
    <div>
      <FormControl
        sx={{
          m: 1,
          minWidth: `${
            keyToFilterBy === "marketSuspended" ? "200px" : "120px"
          }`,
        }}
      >
        <InputLabel id="filterPlayerLabel">{labelName}</InputLabel>
        <Select
          labelId="filterPlayerSelectLabel"
          id="filterPlayerSelect"
          value={selectedValue}
          onChange={handleChange}
          label={labelName}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {uniqueFilterTypes.length > 0 &&
            uniqueFilterTypes.map((fltrType, i) => {
              let fltrTypeLabel = fltrType;
              if (fltrType === 1) {
                fltrTypeLabel = "Yes";
              } else if (fltrType === 0) {
                fltrTypeLabel = "No";
              }
              return (
                <MenuItem key={i} value={fltrType}>
                  {fltrTypeLabel}
                </MenuItem>
              );
            })}
        </Select>
      </FormControl>
    </div>
  );
};

export default FilterDropDown;
