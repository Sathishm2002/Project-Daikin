import React, { useRef, useState } from 'react'
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Pagination,
  Box,
  MenuItem,
  Select,
  FormControl,
  PaginationItem
} from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import { TCCheckBox, TCHeadCheckBox, TCPaper } from './TableComponent.mui.style'
import { ActionTags, AnchorItem, StatusTags } from './TableComponent.style'
import { useLocation, useNavigate } from 'react-router-dom'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForward'

const defaulttableData = {
  headers: [
    { key: 'poNumber', label: 'PO Number' },
    { key: 'currency', label: 'Currency' },
    { key: 'value', label: 'Value' },
    { key: 'date', label: 'Date' },
    { key: 'status', label: 'Status' },
    { key: 'action', label: 'Action' }
  ],
  data: [
    {
      poNumber: '123/1234',
      currency: 'USD',
      value: '25,000.00',
      date: '01/12/2024',
      status: 'Approved',
      action: 'Follow-Up'
    },
    {
      poNumber: '123/1235',
      currency: 'USD',
      value: '45,000.00',
      date: '02/12/2024',
      status: 'Approved',
      action: 'Follow-Up'
    },
    {
      poNumber: '123/1236',
      currency: 'USD',
      value: '20,000.00',
      date: '03/12/2024',
      status: 'Approved',
      action: 'Follow-Up'
    },
    {
      poNumber: '123/1237',
      currency: 'USD',
      value: '1,25,000.00',
      date: '04/12/2024',
      status: 'Approved',
      action: 'Follow-Up'
    },
    {
      poNumber: '123/1238',
      currency: 'USD',
      value: '45,000.00',
      date: '05/12/2024',
      status: 'Cancelled',
      action: 'Follow-Up'
    },
    {
      poNumber: '123/1239',
      currency: 'USD',
      value: '1,25,000.00',
      date: '06/12/2024',
      status: 'Approved',
      action: 'Follow-Up'
    },
    {
      poNumber: '123/1240',
      currency: 'USD',
      value: '45,000.00',
      date: '07/12/2024',
      status: 'Cancelled',
      action: 'Follow-Up'
    },
    {
      poNumber: '123/1241',
      currency: 'USD',
      value: '1,25,000.00',
      date: '08/12/2024',
      status: 'Approved',
      action: 'Follow-Up'
    },
    {
      poNumber: '123/1242',
      currency: 'USD',
      value: '45,000.00',
      date: '09/12/2024',
      status: 'Approved',
      action: 'Follow-Up'
    },
    {
      poNumber: '123/1243',
      currency: 'USD',
      value: '1,25,000.00',
      date: '10/12/2024',
      status: 'Approved',
      action: 'Follow-Up'
    },
    {
      poNumber: '123/1244',
      currency: 'USD',
      value: '45,000.00',
      date: '11/12/2024',
      status: 'Approved',
      action: 'Follow-Up'
    },
    {
      poNumber: '123/1245',
      currency: 'USD',
      value: '1,25,000.00',
      date: '12/12/2024',
      status: 'Approved',
      action: 'Follow-Up'
    },
    {
      poNumber: '123/1246',
      currency: 'USD',
      value: '45,000.00',
      date: '13/12/2024',
      status: 'Cancelled',
      action: 'Follow-Up'
    },
    {
      poNumber: '123/1247',
      currency: 'USD',
      value: '1,25,000.00',
      date: '14/12/2024',
      status: 'Approved',
      action: 'Follow-Up'
    }
  ]
}

const TableComponent = ({
  width = '100%',
  checkboxRequired = false,
  tableData = defaulttableData.data,
  tableHeaders = defaulttableData.headers,
  onSelectionChange,
  redirectUrl,
  handleRedirectUrl = null
}) => {
  const headers = tableHeaders
  const data = tableData

  //const { headers, data } = tableData // Destructure headers and data from defaulttableData
  const [selected, setSelected] = useState([])
  const [orderBy, setOrderBy] = useState(headers[0].key) // Default sort by the first header key
  const [order, setOrder] = useState('asc') // Default sort order
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(5) // Default rows per page
  const navigate = useNavigate()
  const location = useLocation() // Get the current location

  const handleStaticRedirect = () => {
    navigate(redirectUrl)
  }

  const redirectHandler = (data) => {
    if (handleRedirectUrl) {
      handleRedirectUrl(data)
    } else {
      handleStaticRedirect()
    }
  }

  const handleRedirect = (type, id) => {
    const searchParams = new URLSearchParams(location.search)
    searchParams.set('type', type)
    searchParams.set('id', id)
    navigate(`${location.pathname}?${searchParams?.toString()}`) // Preserve the current path, update params
  }

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = data.map((row) => row[headers[0].key]) // Use the first header key as the unique identifier
      setSelected(newSelected)
      onSelectionChange(newSelected)
    } else {
      setSelected([])
    }
  }

  const handleRowCheckboxClick = (event, id) => {
    const selectedIndex = selected.indexOf(id)
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else {
      newSelected = selected.filter((item) => item !== id)
    }

    setSelected(newSelected)
    onSelectionChange(newSelected)
  }

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handlePageChange = (event, newPage) => {
    setPage(newPage)
  }

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(event.target.value)
    setPage(1) // Reset to the first page when rows per page changes
  }

  const isSelected = (id) => selected.indexOf(id) !== -1

  const sortedData = data.slice().sort((a, b) => {
    if (order === 'asc') {
      return a[orderBy] > b[orderBy] ? 1 : -1
    } else {
      return a[orderBy] < b[orderBy] ? 1 : -1
    }
  })

  const paginatedData = sortedData.slice((page - 1) * rowsPerPage, page * rowsPerPage)

  // Drag Table
  const tableRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const handleMouseDown = (e) => {
    setIsDragging(true)
    setStartX(e.pageX - tableRef.current.offsetLeft)
    setScrollLeft(tableRef.current.scrollLeft)
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    e.preventDefault()
    const x = e.pageX - tableRef.current.offsetLeft
    const walk = (x - startX) * 2 // Adjust speed
    tableRef.current.scrollLeft = scrollLeft - walk
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  return (
    <TCPaper>
      <div
        ref={tableRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ width: '100%', overflowX: 'auto' }}>
        <Table sx={{ width: width }}>
          <TableHead sx={{ height: '46px' }}>
            <TableRow>
              {checkboxRequired && (
                <TableCell
                  padding="checkbox"
                  sx={{
                    backgroundColor: '#017EBD',
                    color: 'white',
                    fontSize: '0.9rem',
                    fontWeight: 'bold'
                  }}>
                  <TCHeadCheckBox
                    indeterminate={selected.length > 0 && selected.length < data.length}
                    checked={selected.length === data.length}
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
              )}
              {headers.map((header) => (
                <TableCell
                  key={header.key}
                  sx={{
                    backgroundColor: '#017EBD',
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: '600'
                  }}>
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                    onClick={() => handleSort(header.key)}>
                    {header.label}
                    <Box sx={{ display: 'flex', flexDirection: 'column', ml: 1 }}>
                      <ArrowDropUpIcon
                        sx={{
                          color: orderBy === header.key && order === 'asc' ? 'white' : '#7ab7d6',
                          height: '1rem',
                          width: '1rem',
                          marginBottom: '-6px'
                        }}
                      />
                      <ArrowDropDownIcon
                        sx={{
                          color: orderBy === header.key && order === 'desc' ? 'white' : '#7ab7d6',
                          height: '1rem',
                          width: '1rem',
                          marginBottom: '-3px'
                        }}
                      />
                    </Box>
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row) => {
              const isItemSelected = isSelected(row[headers[0].key]) // Use the first header key as the unique identifier
              return (
                <TableRow
                  key={row[headers[0].key]}
                  hover
                  role="checkbox"
                  aria-checked={isItemSelected}
                  selected={isItemSelected}>
                  {checkboxRequired && (
                    <TableCell padding="checkbox">
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}>
                        <TCCheckBox
                          checked={isItemSelected}
                          onClick={(event) => handleRowCheckboxClick(event, row[headers[0].key])}
                        />
                      </Box>
                    </TableCell>
                  )}
                  {headers.map((header) => (
                    <TableCell
                      key={header.key}
                      sx={{
                        fontSize: '0.8rem',
                        ...(header.key === 'status' && { minWidth: '180px', padding: '8px 16px' })
                      }}>
                      {header.key === 'status' ? (
                        <StatusTags type={`${row[header.key]}`.toLowerCase()}>
                          {row[header.key]}
                        </StatusTags>
                      ) : header.key === 'action' ? (
                        <ActionTags type={`${row[header.key]}`.toLowerCase()}>
                          {row[header.key]}
                        </ActionTags>
                      ) : header.key === 'poNumber' ||
                        header.key === 'po_number' ||
                        header.key === 'invoiceNo' ||
                        header.key === 'creditNoteNo' ||
                        header.key === 'month' ||
                        header.key === 'invoice_number' ? (
                        //   <AnchorItem onClick={() => handleRedirect('poNumber', row[header.key])}>
                        //   {row[header.key]}
                        // </AnchorItem>

                        //temporary static redirection for development
                        <AnchorItem onClick={() => redirectHandler(row)}>
                          {row[header.key]}
                        </AnchorItem>
                      ) : (
                        row[header.key]
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 20px',
          fontSize: '0.8rem'
        }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              paddingInlineEnd: '16px',
              borderRight: '1px solid #EEEFF1',
              fontSize: '15px',
              color: '#5F6368'
            }}
            className="tableFooter">
            Now on Page <span style={{ color: '#1956DD', fontWeight: 'bold' }}>{page}</span> of{' '}
            {Math.ceil(data.length / rowsPerPage)}
          </div>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              paddingInlineStart: '16px',
              color: '#5F6368',
              fontSize: '15px',
              height: '18px',
              width: '73px'
            }}>
            <span>Displaying</span>
            <FormControl variant="outlined" size="small" className="display">
              <Select
                className="display"
                size="small"
                sx={{
                  color: '#5F6368',
                  backgroundColor: '#E5EBFF',
                  border: 'none !important',
                  height: '18px!important',
                  width: '62px!important',
                  px: '2px',
                  '& fieldset': { border: 'none !important' },
                  fontSize: '15px',
                  marginLeft: '65px',
                  height: '52px !important',
                  '& .MuiSelect-select': {
                    paddingRight: '25px !important' // Override the default padding
                  }
                }}
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                //        label="Rows per page"
                label="" // Set it to empty to hide label
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
              </Select>
            </FormControl>
            {/* <span>per page</span> */}
          </Box>
          {/* <span>per page</span> */}
        </div>
        <span className="perpage">per page</span>
        <Pagination
          count={Math.ceil(data.length / rowsPerPage)}
          //count={50}
          page={page}
          onChange={handlePageChange}
          color="primary"
          sx={{
            '.MuiPaginationItem-root': {
              color: '#2D2C2C',
              fontWeight: 500,
              fontSize: '16px',
              maxWidth: '32px',
              maxHeight: '32px',
              minHeight: '32px',
              minWidth: '32px',
              radius: '24px'
            },
            '.MuiPaginationItem-root.Mui-selected': {
              backgroundColor: '#017EBD',
              color: 'white'
            },
            '.MuiPaginationItem-previousNext': {
              color: '#017EBD',
              backgroundColor: '#E5EBFF',
              borderRadius: '24px',
              padding: '5px',
              Width: '32px',
              Height: '32px'
            },
            '.MuiPaginationItem-icon': {
              height: '16px',
              width: '16px'
            }
          }}
          renderItem={(item) => (
            <PaginationItem
              components={{ previous: ArrowBackIosNewIcon, next: ArrowForwardIosIcon }}
              {...item}
            />
          )}
        />
      </Box>
    </TCPaper>
  )
}

export default TableComponent
