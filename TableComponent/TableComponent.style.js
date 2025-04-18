import styled from 'styled-components'
import { theme } from 'theme'

const statusStyles = {
  open: { color: theme.colors.primary, borderColor: theme.colors.primary },
  approved: { color: theme.colors.primary, borderColor: theme.colors.primary },
  reconciled: { color: theme.colors.primary, borderColor: theme.colors.primary },
  'fully reconciled': { color: theme.colors.primary, borderColor: theme.colors.primary },
  cancelled: { color: '#EB2E2E', borderColor: '#EB2E2E' },
  rejected: { color: '#EB2E2E', borderColor: '#EB2E2E' },
  mismatch: { color: '#EB2E2E', borderColor: '#EB2E2E' },
  'not reconciled': { color: '#EB2E2E', borderColor: '#EB2E2E' },
  default: { color: '#1A1A1A', borderColor: 'black' },
  'under review': { color: '#D59C00', bgColor: '#fdbd6280' },
  'partially reconciled': { color: '#D59C00', bgColor: '#fdbd6280' },
  resolved: { color: '#188A42', bgColor: '#d4edda' },
  submitted: { color: theme.colors.primary, bgColor: '#80d4ff40' }
}

export const StatusTags = styled.span`
  color: ${({ type }) => (statusStyles[type] || statusStyles.default).color};
  padding: ${({ type }) => (type === 'under review' ? '5px 30px' : '5px 40px')};
  border-radius: 50px;
  box-shadow: 0px 0px 2px 0 rgb(0 0 0 / 25%);
`

export const AnchorItem = styled.div`
  color: ${theme.colors.primary};
  text-decoration: underline;
  font-weight: bold;
  cursor: pointer;
`

export const ActionTags = styled.span`
  background-color: ${theme.colors.primary};
  color: #fff;
  padding: 5px 20px;
  border-radius: 50px;
`

export const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 400px;
`

export const SearchInputTable = styled.input`
  border-radius: 50px;
  padding-left: 40px !important; /* Make space for icon */
  background-color: #f5f6fa;
  outline: none;
  padding: 8px;
  border: 0.6px solid #d5d5d5;
  cursor: pointer;
  height: 43.38px;
  width: 400px;

  &:focus {
    background: #fdfdfd;
    border: 1px solid #0066b3;
    box-shadow: none;
  }
  &::placeholder {
    font-size: 14px;
    font-weight: 400;
    color: #202224;
    opacity: 50%;
  }
`

export const SearchIconWrapper = styled.div`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
  align-self: center;
`

export const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: white;
  border: 1px solid #d5d5d5;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
`

export const DropdownItem = styled.div`
  padding: 10px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #f0f0f0;
  }
`

export const TableHeaderDropdown = styled.div`
  display: flex;
  flex-direction: column;
  align-items: baseline;
  justify-content: flex-start;
  font-size: 12px;
  font-weight: 400;
  maxwidth: 244px;
  font-height: 15px;

  select {
    background-color: #fcfcfc !important;
  }
`

export const TableDropDownSelectBox = styled.select`
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 0.875rem;
  outline: none;
`

export const TableDropDownLabel = styled.label`
  font-size: 0.75rem;
  font-weight: 400;
`
export const SortIcon = styled.img``
