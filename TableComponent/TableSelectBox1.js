import React, { useState } from "react";
import {
  TableDropDownLabel,
  TableHeaderDropdown,
} from "./TableComponent.style";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import { TCCheckBox } from "./TableComponent.mui.style";

export const TableSelectBox = ({
  label,
  options = [],
  width = "fit-content",
  multiSelect = false, // Prop to enable multi-select
  handleChange,
  selectedValues,
  handleCheckboxChange,
  name=''
}) => {
  //const [selectedValues, setSelectedValues] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Handle selection of options
  /*const handleChange = (event) => {
    const value = event.target.value;
    setSelectedValues(value);
  };*/

  // Handle checkbox click
  /*const handleCheckboxChange = (option) => {
    setSelectedValues((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };*/

  // Filter options based on search input
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <TableHeaderDropdown>
      <TableDropDownLabel>{label}</TableDropDownLabel>
      <FormControl sx={{ width: width }}>
        <Select
          name={name}
          multiple={multiSelect}
          value={selectedValues}
          onChange={handleChange}
          displayEmpty
          renderValue={(selected) => {
            if(multiSelect) {
              return selected.length ? selected.join(", ") : label
            } else {
              return selected ? selected : label;
            }
          }
          }
          sx={{
            borderRadius: "8px",
            padding: "8px 16px",
            fontSize: "14px",
            outline: "none",
          }}
        >
          {multiSelect && (
            <MenuItem disabled>
              <TextField
                size="small"
                placeholder="Search..."
                fullWidth
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon style={{ color: "#000" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    border: "1px solid black",
                    borderRadius: "4px",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid black",
                  },
                  "& .MuiInputBase-input::placeholder": {
                    color: "black",
                    opacity: 1,
                  },
                }}
              />
            </MenuItem>
          )}
          {multiSelect ? filteredOptions.map((option, i) => (
            <MenuItem key={i} value={option} onClick={() => handleCheckboxChange(option)}>
              {multiSelect && (
                <TCCheckBox checked={selectedValues.includes(option)} />
              )}
              {option}
            </MenuItem>
          )) : options.map((option, i) => (
            <MenuItem key={i} value={option}>
              {option}
            </MenuItem>
          )) }
        </Select>
      </FormControl>
    </TableHeaderDropdown>
  );
};
