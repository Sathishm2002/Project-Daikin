import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './POBasedList.module.scss'
import invoiceIcon from '../../../../../assets/icons/invoiceIcon.svg'
import emailReport from '../../../../../assets/icons/emailReport.svg'
import download from '../../../../../assets/icons/downloadIcon2.svg'
import helpIcon from '../../../../../assets/icons/helpIcon.svg'
import TableComponent from 'components/Common/TableComponent'
import { TableHeaderDropdown } from 'components/Common/TableComponent/TableComponent.style'
import EmailReportComp from 'components/Vendor/EmailReport'
import DownloadReportComp from 'components/Vendor/DownloadReportModal'
import DateRangePicker from 'components/Common/DateRangePicker'
import SearchInput from 'components/Common/SearchInput'
import { LeftPageContainer } from 'pages/vendor/dashboard/dashboard.styles'
import { TableSelectBox } from 'components/Common/TableComponent/TableSelectBox'
import { HeaderBar } from 'components/Common/HeaderBar'
import { NormalButton } from 'components/Common/NormalButton'
import { UtilIcon } from '../../../../Common/UtilIcon'
import { connect } from 'react-redux'
import { FINANCE_USER_TYPE, VENDOR_USER_TYPE } from 'constants/userType'
import { INVOICE_PO_BASED } from 'constants/url'
import { useTranslation } from 'react-i18next'
import {
  exportPOInvoiceListing,
  getPOInvoiceListing,
  emailPOInvoiceDetailsReport
} from 'api/POBased' // Adjust path if needed
import dayjs from 'dayjs'
import { downloadHelper } from 'services/utilities'

const POBasedListComp = ({ userInfo: { userType } }) => {
  const navigate = useNavigate()
  const { t } = useTranslation('po_based_report')

  const [emailReportState, setEmailReportState] = useState(false)
  const [downloadReport, setDownloadReport] = useState(false)
  const [listData, setListData] = useState([])
  const [emailReportDateRange, setEmailReportDateRange] = useState([dayjs(), dayjs()])
  const [filters, setFilters] = useState({
    search: '',
    start_date: null,
    end_date: null,
    currency: '',
    created_by: '',
    sort_column: '',
    sort: ''
  })

  useEffect(() => {
    fetchPOBasedList()
  }, [filters])

  const fetchPOBasedList = () => {
    const query = {
      entity_id: 1, // Default param
      ...filters
    }

    // Clean up empty or null values
    Object.keys(query).forEach((key) => {
      if (!query[key] || query[key].length === 0) delete query[key]
    })

    getPOInvoiceListing(query)
      .then((res) => {
        console.log(res.data?.data)
        setListData(res?.data?.data?.results || [])
      })
      .catch((err) => {
        console.error('Error fetching PO invoices:', err)
      })
  }

  const handleFilterChange = (newFilter) => {
    const key = Object.keys(newFilter)[0]
    let value = newFilter[key]

    // Special handling for sort
    if (key === 'sort_column' && value) {
      const [column, direction = 'ASC'] = value.split(' ')
      setFilters((prev) => ({
        ...prev,
        sort_column: column,
        sort: direction.toUpperCase()
      }))
    } else if (key === 'invoice_date' && value) {
      // Assuming value is an array from DateRangePicker
      setFilters((prev) => ({
        ...prev,
        start_date: value[0]?.format('YYYY-MM-DD'),
        end_date: value[1]?.format('YYYY-MM-DD') || value[0]?.format('YYYY-MM-DD')
      }))
    } else if (key === 'search') {
      setFilters((prev) => ({
        ...prev,
        search: Array.isArray(value) ? value.join(',') : value // Handle both text and multi-select
      }))
    } else {
      setFilters((prev) => ({
        ...prev,
        [key]: value
      }))
    }
  }

  const handleCloseDownload = () => {
    setDownloadReport(false)
  }

  const handleCreateInvoice = () => {
    navigate(`/${VENDOR_USER_TYPE}${INVOICE_PO_BASED}/invoice`)
  }

  const downloadCSV = () => {
    const query = {
      entity_id: 1,
      format: 'csv'
    }
    exportPOInvoiceListing(query)
      .then((res) => {
        downloadHelper(res.data)
        handleCloseDownload()
      })
      .catch((err) => {
        console.error(err)
      })
  }

  const handleClosePopup = () => {
    setEmailReportState(false)
  }

  const handleSendEmailReport = () => {
    const query = {
      startDate: emailReportDateRange[0].format('YYYY-MM-DD'),
      endDate: emailReportDateRange[1].format('YYYY-MM-DD'),
      entity_id: 1
    }

    emailPOInvoiceDetailsReport(query)
      .then(() => {
        handleClosePopup()
      })
      .catch((err) => {
        console.error(err)
      })
  }

  const headers = [
    { key: 'invoiceNo', label: 'Invoice No' },
    { key: 'date', label: 'Date' },
    { key: 'currency', label: t('currency.text') },
    { key: 'invoiceValue', label: 'Invoice Value' },
    { key: 'invoiceDueDate', label: t('invoiceDueDate.text') },
    { key: 'createdBy', label: t('createdBy.text') },
    { key: 'status', label: 'Status' }
  ]

  const mapStatus = (status) => {
    const statusMap = {
      1: 'Draft',
      2: 'Submitted',
      3: 'Under Review',
      4: 'Approved',
      5: 'Rejected'
    }
    return statusMap[status] || 'Unknown'
  }

  const formattedData = listData?.map((item) => ({
    invoiceNo: item.vendor_invoice_number,
    date: dayjs(item.invoice_date).format('DD/MM/YYYY'),
    currency: item.currency_type || 'N/A',
    invoiceValue: item.total_amount.toLocaleString(),
    invoiceDueDate: item.invoice_due_date
      ? new Date(item.invoice_due_date).toLocaleDateString()
      : 'N/A',
    createdBy: item?.createdBy || 'N/A',
    status: mapStatus(item.status)
  }))

  return (
    <LeftPageContainer>
      <div className={styles.poContainer}>
        <HeaderBar title="Invoice Processing PO Based" slug="Home / Invoice Processing / PO Based">
          {userType === VENDOR_USER_TYPE && (
            <NormalButton
              label="Create Invoice"
              isPrimary
              customClass="px-3"
              height="200px"
              leftIcon={invoiceIcon}
              onClick={handleCreateInvoice}
            />
          )}
          <div style={{ display: 'flex', marginRight: '0' }}>
            <UtilIcon src={emailReport} onClick={() => setEmailReportState(true)} />
            <UtilIcon onClick={() => setDownloadReport(true)} src={download} />
          </div>
          {userType === VENDOR_USER_TYPE && <UtilIcon style={{ marginLeft: 0 }} src={helpIcon} />}
        </HeaderBar>
      </div>
      {/* Filters */}
      <div className="bg-white shadow rounded-lg">
        <div className={styles.tableHeaderContainer}>
          <SearchInput
            placeholder="Search for Invoice No."
            showDropdown={false}
            onChange={(value) => handleFilterChange({ search: value })}
          />
          <div className="d-flex gap-4">
            <TableHeaderDropdown className="flex items-center">
              <label>Select Date</label>
              <DateRangePicker
                type="range"
                onChange={(dates) => handleFilterChange({ invoice_date: dates })}
              />
            </TableHeaderDropdown>
            {userType === FINANCE_USER_TYPE ? (
              <TableSelectBox
                label="Status"
                options={['All', 'Active', 'Inactive']}
                multiSelect
                onFilterChange={handleFilterChange}
              />
            ) : (
              <TableSelectBox
                label={t('currency.text')}
                options={['USD', 'EUR', 'INR']}
                onFilterChange={handleFilterChange}
              />
            )}
            <TableSelectBox
              label={userType === FINANCE_USER_TYPE ? 'Vendor Name/Code' : 'Created By'}
              options={['Aaliyah', 'Amir', 'John Doe', 'Jane Doe']}
              onFilterChange={handleFilterChange}
            />
          </div>
        </div>
        <TableComponent tableHeaders={headers} tableData={formattedData} />
      </div>
      <EmailReportComp
        onClose={() => setEmailReportState(false)}
        value={emailReportDateRange}
        setValue={setEmailReportDateRange}
        open={emailReportState}
        onSend={handleSendEmailReport}
      />
      <DownloadReportComp
        headers={headers}
        tableData={formattedData}
        open={downloadReport}
        onClose={() => setDownloadReport(false)}
        title="PO based-Invoice list.pdf"
        onClickSubmit={downloadCSV}
      />
    </LeftPageContainer>
  )
}

const mapStateToProps = (state) => ({
  userInfo: state.userInfo
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(POBasedListComp)
