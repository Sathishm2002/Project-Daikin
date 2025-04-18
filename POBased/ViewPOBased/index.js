import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import backArrow from '../../../../../assets/icons/backArrow.svg'
import emailReport from '../../../../../assets/icons/emailReport.svg'
import download from '../../../../../assets/icons/downloadIcon2.svg'
import helpIcon from '../../../../../assets/icons/helpIcon.svg'
import styles from './ViewPOBased.module.scss'
import TableComponent from 'components/Common/TableComponent'
import { LeftPageContainer } from 'pages/vendor/dashboard/dashboard.styles'
import DownloadReportComp from 'components/Vendor/DownloadReportModal'
import { HeaderBar } from 'components/Common/HeaderBar'
import { NormalButton } from 'components/Common/NormalButton'
import { connect } from 'react-redux'
import { VENDOR_USER_TYPE } from 'constants/userType'
import { useTranslation } from 'react-i18next'
import { getPOInvoiceDetails } from 'api/POBased' // Hypothetical API import

const ViewPOBasedComp = ({ userInfo: { userType } }) => {
  const navigate = useNavigate()
  const { id } = useParams() // Extract invoiceId from URL
  const { t } = useTranslation('po_based_report')
  const [downloadReport, setDownloadReport] = useState(false)
  const [invoiceData, setInvoiceData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch invoice details on mount
  useEffect(() => {
    const fetchInvoiceDetails = async () => {
      try {
        setLoading(true)
        const response = await getPOInvoiceDetails({ invoice_id: id, entity_id: 1 }) // Adjust API call as needed
        setInvoiceData(response?.data?.data || response?.data)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching invoice details:', err)
        setError('Failed to load invoice details.')
        setLoading(false)
      }
    }

    if (id) {
      fetchInvoiceDetails()
    }
  }, [id])

  const handleEdit = () => {
    navigate(`/vendor/invoice-processing/po-based/1`) // Adjust if edit mode needs ID
  }

  const handleDownload = () => {
    setDownloadReport(true)
  }

  const handleCloseDownload = () => {
    setDownloadReport(false)
  }

  const headers = [
    { key: 'lineItemNo', label: t('lineItemNumber.text') },
    { key: 'poNo', label: 'PO No.' },
    { key: 'poLineItemNo', label: 'PO Line Item No.' },
    { key: 'materialCode', label: t('materialCode.text') },
    { key: 'materialDescription', label: t('materialDescription.text') },
    { key: 'uom', label: t('uom.text') },
    { key: 'poQuantity', label: t('poQuantity.text') },
    { key: 'grQuantity', label: t('grQuantity.text') },
    { key: 'irQuantity', label: t('irQuantity.text') },
    { key: 'lineItemValue', label: t('lineItemValue.text') },
    { key: 'taxLineItem', label: t('taxLineItem.text') }
  ]

  const formattedTableData =
    invoiceData?.purchaseOrderData?.results?.map((item) => ({
      lineItemNo: item.id || 'N/A',
      poNo: item?.material?.po_number || 'N/A',
      poLineItemNo: item.id || 'N/A',
      materialCode: item.material_code || 'N/A',
      materialDescription: item.material_description || 'N/A',
      uom: item.unit_of_measure || 'N/A',
      poQuantity: item.po_quantity || 0,
      grQuantity: item.goods_receipt?.gr_quantity || 0,
      irQuantity: item.ir_quantity || 0,
      lineItemValue: item.line_item_value || 0,
      taxLineItem: item.tax_line_item || 'N/A'
    })) || []

  if (loading) {
    return <LeftPageContainer>Loading...</LeftPageContainer>
  }

  if (error) {
    return <LeftPageContainer>{error}</LeftPageContainer>
  }

  return (
    <LeftPageContainer>
      {/* Header */}
      <div className={styles.poContainer}>
        <HeaderBar
          title={`Invoice Details - ${id}/45625`}
          slug="Home / Invoice Processing / PO Based / Invoice Details"
          statusTag={
            userType === VENDOR_USER_TYPE ? undefined : invoiceData?.status || 'under review'
          }>
          <div className={styles.helpIconContainer}>
            <img src={emailReport} alt="email" />
          </div>
          <div className={styles.helpIconContainer} onClick={handleDownload}>
            <img src={download} alt="download" />
          </div>
          {userType === VENDOR_USER_TYPE && (
            <>
              <div className={styles.helpIconContainer}>
                <img src={helpIcon} alt="help" />
              </div>
              <div>
                <NormalButton label="Edit" isPrimary customClass="px-3" onClick={handleEdit} />
              </div>
            </>
          )}
        </HeaderBar>
      </div>

      {/* User Input Section */}
      <div className={styles.userInputContainer}>
        <div className={`${styles.verticalDivider} col-4`}>
          <div className={styles.userInputContainerInner}>
            <div className={styles.inputQues}>
              <label>{t('vendorInvoiceNumber.text')}:</label>
              <label>{t('invoiceDate.text')}:</label>
              <label>{t('poNumber.text')}:</label>
            </div>
            <div className={styles.inputAns}>
              <label>{invoiceData?.vendor_invoice_number || 'N/A'}</label>
              <label>{invoiceData?.invoice_date || 'N/A'}</label>
              <label>{invoiceData?.purchase_order_id?.join(', ') || 'N/A'}</label>
            </div>
          </div>
        </div>
        <div className={`${styles.verticalDivider} col-4`}>
          <div className={styles.userInputContainerInner}>
            <div className={styles.inputQues}>
              <label>Invoice Posting Date:</label>
              <label>{t('currency.text')}:</label>
              <label>Uploaded Invoice File:</label>
            </div>
            <div className={styles.inputAns}>
              <label>{invoiceData?.invoice_date || 'N/A'}</label> {/* Adjust if separate field */}
              <label>{invoiceData?.currency || 'N/A'}</label>
              <label>
                {invoiceData?.attachment?.length > 0
                  ? invoiceData.attachment.map((file) => file.name || file).join(', ')
                  : 'No files'}
              </label>
            </div>
          </div>
        </div>
        <div className={`col-4`}>
          <div className={styles.userInputContainerInner}>
            <div className={styles.inputQues}>
              <label>Total Invoice Amount:</label>
              <label>{t('totalTaxAmount.text')}:</label>
              <label>{t('paymentTerms.text')}:</label>
              <label>Payment Advice:</label>
            </div>
            <div className={styles.inputAns}>
              <label>{invoiceData?.total_amount || invoiceData?.invoice_amount || 'N/A'}</label>
              <label>{invoiceData?.tax_amount || 'N/A'}</label>
              <label>{invoiceData?.payment_terms || 'N/A'}</label>
              <label>{invoiceData?.payment_advice || 'N/A'}</label>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg">
        <TableComponent width={'150%'} tableHeaders={headers} tableData={formattedTableData} />
      </div>

      <DownloadReportComp
        open={downloadReport}
        onClose={handleCloseDownload}
        title={`PO based-Invoice ${id}.pdf`}
      />
    </LeftPageContainer>
  )
}

const mapStateToProps = (state) => ({
  userInfo: state.userInfo
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(ViewPOBasedComp)
