// StyledCheckbox.js
import { padding, styled } from '@mui/system'
import { Checkbox, Paper } from '@mui/material'
import { theme } from 'theme'

export const TCCheckBox = styled(Checkbox)(({}) => ({
  color: theme.colors.primary,
  '&.Mui-checked': {
    color: theme.colors.primary
  }
}))

export const TCHeadCheckBox = styled(Checkbox)(({}) => ({
  color: '#FFF',
  borderRadius: '10px',
  '&.Mui-checked': {
    color: '#FFF'
  },
  '&.MuiCheckbox-indeterminate': {
    color: '#FFF'
  }
}))

export const TCPaper = styled(Paper)(({}) => ({
  '& .MuiPaper-root': {
    boxShadow: 'none !important'
  },
  '& th.MuiTableCell-root': {
    padding: '4px 16px !important'
  }
}))
