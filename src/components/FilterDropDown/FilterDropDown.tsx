import * as React from "react";

// Material UI components
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

// Types
import { FilterProps } from "../../types/Types";

const FilterDropDown: React.FC<FilterProps> = ({
  labelName,
  keyToFilterBy,
  filterOptions,
  setFilterType,
}) => {
  const [selectedValue, setSelectedValue] = React.useState<string>("");

  const handleChange = React.useCallback(
    (event: SelectChangeEvent) => {
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
    },
    [keyToFilterBy, setFilterType]
  );

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
          {filterOptions.length > 0 &&
            filterOptions.map((option, i) => {
              const { label, value } = option;
              let fltrTypeLabel = label;
              if (value === 1) {
                fltrTypeLabel = "Yes";
              } else if (value === 0) {
                fltrTypeLabel = "No";
              }
              return (
                <MenuItem key={i} value={value}>
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
