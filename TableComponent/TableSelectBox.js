import React, { useState } from 'react'
import { TableDropDownLabel, TableHeaderDropdown } from './TableComponent.style'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import { TCCheckBox } from './TableComponent.mui.style'

export const TableSelectBox = ({
  label,
  options = [],
  width = 'fit-content',
  multiSelect = false,
  onFilterChange // Callback to notify parent of changes
}) => {
  const [selectedValues, setSelectedValues] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  // Handle selection of options
  const handleChange = (event) => {
    const value = event.target.value
    setSelectedValues(value)
    onFilterChange({ [labelToQueryKey(label)]: value }) // Notify parent
  }

  // Handle checkbox click for multi-select
  const handleCheckboxChange = (option) => {
    const newValues = selectedValues.includes(option)
      ? selectedValues.filter((item) => item !== option)
      : [...selectedValues, option]
    setSelectedValues(newValues)
    onFilterChange({ [labelToQueryKey(label)]: newValues }) // Notify parent
  }

  // Handle search input change
  const handleSearchChange = (e) => {
    const term = e.target.value
    setSearchTerm(term)
    if (label.toLowerCase() === 'search') {
      onFilterChange({ search: term }) // Notify parent for search
    }
  }

  // Map label to query parameter key
  const labelToQueryKey = (label) => {
    switch (label.toLowerCase()) {
      case 'currency':
        return 'currency'
      case 'created by':
        return 'created_by'
      case 'date':
        return 'invoice_date' // Adjust based on your API
      case 'sort':
        return 'sort_column'
      case 'search':
        return 'search'
      default:
        return label.toLowerCase().replace(' ', '_')
    }
  }

  // Filter options based on search input (for dropdown display)
  const filteredOptions = options?.filter((option) =>
    option?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <TableHeaderDropdown>
      <TableDropDownLabel>{label}</TableDropDownLabel>
      <FormControl sx={{ width: width }}>
        <Select
          multiple={multiSelect}
          value={selectedValues}
          onChange={handleChange}
          displayEmpty
          renderValue={(selected) =>
            multiSelect
              ? selected.length
                ? selected.join(', ')
                : label
              : selected.length
              ? selected
              : label
          }
          sx={{
            borderRadius: '8px',
            padding: '8px 16px',
            fontSize: '14px',
            outline: 'none'
          }}>
          {multiSelect && label.toLowerCase() !== 'search' && (
            <MenuItem disabled>
              <TextField
                size="small"
                placeholder="Search..."
                fullWidth
                value={searchTerm}
                onChange={handleSearchChange}
                onClick={(e) => e.stopPropagation()}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon style={{ color: '#000' }} />
                    </InputAdornment>
                  )
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    border: '1px solid black',
                    borderRadius: '4px'
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: '1px solid black'
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: 'black',
                    opacity: 1
                  }
                }}
              />
            </MenuItem>
          )}
          {filteredOptions.map((option, i) => (
            <MenuItem
              key={i}
              value={option}
              onClick={(e) => {
                if (multiSelect) {
                  e.stopPropagation()
                  handleCheckboxChange(option)
                }
              }}>
              {multiSelect && <TCCheckBox checked={selectedValues.includes(option)} />}
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </TableHeaderDropdown>
  )
}
