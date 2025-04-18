import React, { useState } from 'react'
import TableComponent from 'components/Common/TableComponent'
import CustomModal from 'components/Common/Modal'
import { NormalButton } from 'components/Common'
import styles from './InvoicePreview.module.scss'
import { useTranslation } from 'react-i18next'
import { ADMIN_USER_TYPE } from 'constants/userType'

export const InvoicePreviewPO = ({
  open,
  setNextClick,
  handleSave,
  handleSubmit,
  formData,
  saved,
  title = "Invoice Preview"
}) => {
  const { t } = useTranslation('po_based_invoices')
  const [isLoading, setIsLoading] = useState(false)
  const [userType] = useState('admin')

  const handleSaveClick = () => {
    handleSave({ status: 'Draft' })
    setNextClick(false)
  }

  const handleSubmitClick = () => {
    handleSubmit({ status: 'Submitted' })
    setNextClick(false)
  }

  const handleClose = () => {
    setNextClick(false)
  }

  const modalStyles = {
    padding: 0,
    borderRadius: 0
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

  // Transform formData to table format
  const tableData = formData?.purchaseOrderData?.results?.map((item, index) => ({
    lineItemNo: index + 1,
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

  return (
    <CustomModal open={open} modalStyles={modalStyles}>
      <div className={styles.titleContainer}>
        <div>
          <p className={styles.title}>{title}</p>
        </div>
        <div className={styles.dateContainer}>
          <NormalButton 
            label="Save" 
            isPrimary 
            customClass="px-3" 
            onClick={handleSaveClick}
            disabled={isLoading}
          />
          <NormalButton
            label="Submit"
            isPrimary
            customClass="px-3"
            onClick={handleSubmitClick}
            disabled={isLoading}
          />
          <NormalButton 
            label="Close" 
            outlineBtn 
            customClass="px-3" 
            onClick={handleClose}
            disabled={isLoading}
          />
        </div>
      </div>
      
      <div className={styles.userInputContainerOuter}>
        <div className={styles.userInputContainer}>
          {/* Left Column */}
          <div className={`${styles.verticalDivider} col-4`}>
            <div className={styles.userInputContainerInner}>
              <div className={styles.inputQues}>
                <label>{t('vendorInvoiceReference.text')}:</label>
                <label>{t('invoiceDate.text')}:</label>
                <label>{t('selectedPOList.text')}:</label>
              </div>
              <div className={styles.inputAns}>
                <label>{formData?.vendor_invoice_number || 'N/A'}</label>
                <label>{formData?.invoice_date || 'N/A'}</label>
                <label>{formData?.selectedPoNo || 'N/A'}</label>
              </div>
            </div>
          </div>
          
          {/* Middle Column */}
          <div className={`${styles.verticalDivider} col-4`}>
            <div className={styles.userInputContainerInner}>
              <div className={styles.inputQues}>
                <label>Invoice Posting Date:</label>
                <label>{t('currency.text')}:</label>
                <label>Uploaded Invoice File:</label>
              </div>
              <div className={styles.inputAns}>
                <label>{formData?.invoice_date || 'N/A'}</label>
                <label>{formData?.currency || 'N/A'}</label>
                <label>
                  {formData?.attachment?.length > 0
                    ? formData.attachment.map(file => file.name).join(', ')
                    : 'No files uploaded'}
                </label>
              </div>
            </div>
          </div>
          
          {/* Right Column */}
          <div className="col-4">
            <div className={styles.userInputContainerInner}>
              <div className={styles.inputQues}>
                <label>{t('totalNetValue.text')}:</label>
                <label>{t('totalTaxAmountCalc.text')}:</label>
                <label>{t('paymentTerms.text')}:</label>
              </div>
              <div className={styles.inputAns}>
                <label>{formData?.total_invoice_amount || 'N/A'}</label>
                <label>{formData?.tax_amount || 'N/A'}</label>
                <label>{formData?.payment_terms || 'N/A'}</label>
              </div>
            </div>
          </div>
        </div>

        {/* Attachments Section */}
        {userType === ADMIN_USER_TYPE && formData?.attachment?.length > 0 && (
          <div className={styles.attachmentContainer}>
            <div className={styles.attachmentDetails}>
              <label className={styles.title}>S.No</label>
              {formData.attachment.map((_, index) => (
                <label key={index}>{index + 1}</label>
              ))}
            </div>
            <div className={styles.attachmentDetails}>
              <label className={styles.title}>{t('attachmentType.text')}</label>
              {formData.attachment.map((_, index) => (
                <label key={index}>{formData.attachment_type || 'N/A'}</label>
              ))}
            </div>
            <div className={styles.attachmentDetails}>
              <label className={styles.title}>Document Name</label>
              {formData.attachment.map((file, index) => (
                <label key={index}>{file.name}</label>
              ))}
            </div>
          </div>
        )}

        {/* Invoice Line Items Table */}
        <TableComponent 
          width="150%" 
          tableHeaders={headers} 
          tableData={tableData}
          isLoading={isLoading}
        />
      </div>
    </CustomModal>
  )
}