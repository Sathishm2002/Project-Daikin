import styled from 'styled-components'
import { Box } from '@mui/material'
import { theme } from 'theme'

export const HeaderBarBoxContainer = styled(Box)``

export const HeaderBarSubHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;

  @media (max-width: 919px) {
    gap: 3rem;
  }
  @media (max-width: 1279px) {
    gap:3rem
  }
`

export const HeaderBarSubBox = styled.div`
  display: flex;
  gap: 10px;
  cursor: pointer;
`

const statusStyles = {
  'under review': { color: '#D59C00', bgColor: '#fdbd6280' },
  resolved: { color: '#188A42', bgColor: '#d4edda' },
  submitted: { color: theme.colors.primary, bgColor: '#80d4ff40' },
  approved: { color: '#188A42', bgColor: '#CAF1D8' },
  rejected: { color: '#EB2E2E', bgColor: '#FBEAEA' },
  'awaiting approval': { color: '#D59C00', bgColor: '#FDBC6180' }
}

export const HeaderStatusTag = styled.span`
  color: ${({ status }) => statusStyles[status]?.color || statusStyles.default.color};
  background-color: ${({ status }) =>
    statusStyles[status]?.bgColor || statusStyles.default.bgColor};
  padding: 5px 15px;
  border-radius: 5px;
  text-transform: uppercase;
  font-size: 0.8rem;
  font-weight: 600;
`
export const HeaderBarHomeLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 400;
  color: #616162;
  line-height: 18.2px;
  align-self: center;
`

export const HeaderBarLabel = styled.label`
   font-size: 20px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary};
  line-height: 27.3px;
  align-self: center;
`

export const HeaderBarIconContainer = styled.div`
  height: 42px;
  width: 42px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background-color: white;
  border-radius: 6px;
  box-shadow: 0px 1px 5.8px 0px #82d5ff40;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`
export const HeaderBarSideButtonContainer = styled.div`
  display: flex;

  & > *:first-child {
    margin-right: 5px;
  }

  & > *:last-child {
    margin-left: 5px;
  }

  & > *:not(:first-child):not(:last-child) {
    margin: 0 5px;
  }
`

