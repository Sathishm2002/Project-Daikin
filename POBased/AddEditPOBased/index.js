import React, { useEffect, useState } from 'react'
import backArrow from '../../../../../assets/icons/backArrow.svg'
import helpIcon from '../../../../../assets/icons/helpIcon.svg'
import styles from './AddEditPOBased.module.scss'
import { NormalButton } from 'components/Common/NormalButton'
import { InputBox } from 'components/Common/InputBox'
import { Controller, useForm } from 'react-hook-form'
import { SelectBox } from 'components/Common/SelectBox'
import nextIcon from '../../../../../assets/icons/nextIconWhite.svg'
import saveIcon from '../../../../../assets/icons/saveIconWhite.svg'
import TableComponent from 'components/Common/TableComponent'
import FileUploadInput from 'components/Common/FileUploadInput'
import { InvoicePreviewPO } from '../InvoicePreview'
import { useNavigate, useParams } from 'react-router-dom'
import SuccessPopup from 'components/Common/SuccessPopup'
import { LeftPageContainer } from 'pages/vendor/dashboard/dashboard.styles'
import DateRangePicker from 'components/Common/DateRangePicker1'
import { useTranslation } from 'react-i18next'
import { createPOInvoice, populatePOInvoice } from 'api/POBased'
import { INVOICE_PO_BASED_VIEW } from 'constants/url'

const AddEditPOBasedComp = () => {
  const {
    register,
    formState: { errors },
    control,
    getValues,
    handleSubmit,
    setValue,
    clearErrors
  } = useForm()

  const navigate = useNavigate()
  const { editMode } = useParams()
  const { t } = useTranslation('po_based_invoices')

  const [nextClick, setNextClick] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [saved, setSaved] = useState(false)
  const [invoiceList, setInvoiceList] = useState({})
  const [selectedDate, setSelectedDate] = useState(null)
  const [uploadedFiles, setUploadedFiles] = useState([])

  useEffect(() => {
    setIsEdit(editMode === '1')
  }, [editMode])

  useEffect(() => {
    fetchInvoiceList()
  }, [])

  const fetchInvoiceList = () => {
    const query = { sort_column: 'po_quantity', sort: 'DESC', entity_id: 1 }
    const body = { purchase_order_id: ['4'] }
    populatePOInvoice(body, query)
      .then((res) => {
        setInvoiceList(res?.data?.data || {})
        const data = res?.data?.data
        setValue('payment_terms', `${data?.vendor_data?.payment_terms} Days` || '')
        setValue('currency', data?.vendor_data?.vendorData?.invoice_currency || '')
        setValue('total_invoice_amount', data?.actual_total_invoice || '')
      })
      .catch((err) => {
        console.error('Error fetching invoice list:', err)
      })
  }

  const handleFormSubmit = (data, options = {}) => {
    const { status } = options
    const invoiceDate = selectedDate ? selectedDate.format('YYYY-MM-DD HH:mm:ss') : ''

    const formData = new FormData()
    formData.append('purchase_order_id', 1) // Changed from array [1] to single integer
    formData.append('vendor_invoice_number', data.vendor_invoice_number)
    formData.append('invoice_date', invoiceDate)
    formData.append('taxed_invoice_amount', parseFloat(data.total_invoice_amount) || 0)
    formData.append('tax_percentage', parseFloat(data.tax_percentage) || 0)
    formData.append('invoice_amount', parseFloat(data.total_invoice_amount) || 0)
    formData.append('tax_amount', parseFloat(data.tax_amount) || 0)
    formData.append('total_amount', parseFloat(data.total_invoice_amount) || 0)
    formData.append('entity_id', 1)
    formData.append('is_document', uploadedFiles.length > 0 ? 1 : 0)
    formData.append('attachment_type', parseInt(data.attachment_type) || 1)

    // Use numeric status values: 0 for Draft, 1 for Submitted
    if (status) {
      formData.append('status', status === 'Draft' ? 0 : 1)
    }

    uploadedFiles.forEach((file, index) => {
      formData.append(`attachment[${index}]`, file)
    })

    console.log('FormData payload being sent to createPOInvoice:')
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`)
    }
    const query = {
      entity_id: 1
    }
    createPOInvoice(formData, query)
      .then((res) => {
        console.log('API Response:', res.data)
        setInvoiceList(res?.data?.data || {})
        setShowSuccessPopup(true)
        const invoiceId = res?.data?.data?.id || res?.data?.id
        if (invoiceId && status === 'Submitted') {
          navigate(`/vendor/invoice-processing/id=${invoiceId}`)
        }
      })
      .catch((err) => {
        console.error('Error creating PO invoice:', err.response?.data || err)
      })
  }

  const handleNext = () => {
    handleSubmit((data) => {
      setNextClick(true)
    })()
  }

  const handleSave = (e) => {
    if (e?.preventDefault) e.preventDefault()
    const options = typeof e === 'object' && e.status ? e : { status: 'Draft' }
    handleSubmit((data) => handleFormSubmit(data, options))()
  }

  const handleSubmitBtn = (options = {}) => {
    handleSubmit((data) => handleFormSubmit(data, options))()
  }

  const handleCloseSuccessPopup = () => {
    setShowSuccessPopup(false)
    setSaved(true)
    setNextClick(false)
    if (!isEdit) {
      navigate('/vendor/invoice-processing/po-based')
    }
  }

  const handleUpdate = () => {
    navigate(INVOICE_PO_BASED_VIEW + '/1')
  }

  const creditNoteOptions = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' }
  ]

  const formattedData =
    invoiceList?.purchaseOrderData?.results?.map((item) => ({
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

  return (
    <LeftPageContainer>
      <form onSubmit={handleSave}>
        <div className={styles.poContainer}>
          <label className={styles.homeText}>
            Home / Invoice Processing / PO Based / Create Invoice
          </label>
          <div className={styles.subHeader}>
            <div>
              <img src={backArrow} alt="Back" onClick={() => navigate(-1)} />
              <label>{isEdit ? 'Edit Invoice' : 'Create Invoicess'}</label>
            </div>
            <div>
              {!isEdit ? (
                <>
                  <NormalButton
                    label="Next"
                    isPrimary
                    customClass="px-3"
                    rightIcon={nextIcon}
                    onClick={handleNext}
                    rightIconClassName={'rtl:rotate-180'}
                  />
                  <NormalButton
                    label="Save"
                    isPrimary
                    customClass="px-3"
                    rightIcon={saveIcon}
                    type="submit"
                  />
                </>
              ) : (
                <NormalButton label="Update" isPrimary customClass="px-3" onClick={handleUpdate} />
              )}
              <div className={styles.helpIconContainer}>
                <img src={helpIcon} alt="help" />
              </div>
            </div>
          </div>
        </div>
        <div className={`${styles.userInputContainer}`}>
          <div style={{ borderInlineEnd: '1px solid #e5e5e5' }} className="col-6">
            <div className="d-flex gap-10">
              <div className={styles.userInputs}>
                <label>
                  {t('vendor_invoice_number.text')} <span className="required">*</span> :
                </label>
                <label>
                  {t('invoice_date.text')} <span className="required">*</span> :
                </label>
                <label>
                  {t('Selection Po Number')} <span className="required">*</span> :
                </label>
              </div>
              <div className={styles.userInputs}>
                <InputBox
                  placeholder="Enter Invoice reference no."
                  className="user-input inputBox"
                  name="vendor_invoice_number"
                  type="text"
                  register={register}
                  rules={{ required: t('vendor_invoice_number.error') }}
                  error={errors.vendor_invoice_number}
                  clearErrors={clearErrors}
                />
                <DateRangePicker value={selectedDate} setValue={setSelectedDate} />
                <Controller
                  name="selectedPoNo"
                  control={control}
                  rules={{ required: t('poSelection.error') }}
                  defaultValue=""
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <div className="select-container">
                      <SelectBox
                        className={`${styles.userInput} custom-select-box`}
                        error={error}
                        label="Selected PO Number"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        options={creditNoteOptions}
                        name="selectedPoNo"
                        isRequired
                        placeholder="Select"
                      />
                    </div>
                  )}
                />
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="d-flex gap-10">
              <div className={`${styles.userInputs} ${styles.verticalDividerLeft}`}>
                <label>
                  {t('tax_percentage.text')} <span className="required">*</span> :
                </label>
                <label>
                  Total Invoice Amount <span className="required">*</span> :
                </label>
                <label>{t('totalTaxAmountCalc.text')} :</label>
                <label>{t('paymentTerms.text')} :</label>
                <label>Currency :</label>
              </div>
              <div className={styles.userInputs}>
                <Controller
                  name="tax_percentage"
                  defaultValue=""
                  control={control}
                  rules={{ required: t('tax_percentage.error') }}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <div className="select-container">
                      <SelectBox
                        className={`${styles.userInput} custom-select-box`}
                        error={error}
                        label="Tax Percentage"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        options={creditNoteOptions}
                        name="tax_percentage"
                        isRequired
                        placeholder="Select"
                      />
                    </div>
                  )}
                />
                <InputBox
                  placeholder="Enter Invoice Value"
                  className="user-input inputBox"
                  name="total_invoice_amount"
                  type="text"
                  register={register}
                  rules={{ required: 'Total Invoice Amount is required' }}
                  error={errors.total_invoice_amount}
                  clearErrors={clearErrors}
                />
                <InputBox
                  placeholder="1,20,000"
                  className="user-input inputBox"
                  name="tax_amount"
                  type="text"
                  register={register}
                  error={errors.tax_amount}
                />
                <InputBox
                  placeholder="90 days"
                  className="user-input inputBox"
                  name="payment_terms"
                  type="text"
                  register={register}
                  error={errors.payment_terms}
                />
                <InputBox
                  placeholder="Currency"
                  className="user-input inputBox"
                  name="currency"
                  type="text"
                  register={register}
                  error={errors.currency}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={`${styles.attachmentContainer}`}>
          <div className="col-6">
            <div className="d-flex gap-10 align-items-center">
              <label className={styles.inputLabel}>
                {t('attachment_type.text')} <span className="required">*</span> :
              </label>
              <Controller
                name="attachment_type"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <div className="select-container">
                    <SelectBox
                      className={`${styles.userInput} custom-select-box`}
                      error={error}
                      label="Attachment Type"
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      options={creditNoteOptions}
                      name="attachment_type"
                      isRequired
                      placeholder="Select"
                    />
                  </div>
                )}
              />
            </div>
          </div>
          <div className="col-6">
            <div className="d-flex gap-10 align-items-center">
              <label className={styles.inputLabel}>
                {t('invoiceFileUpload.text')} <span className="required">*</span> :
              </label>
              <FileUploadInput
                customClassName="!mt-0"
                onChange={(event) => {
                  const files = Array.from(event.target.files)
                  setUploadedFiles(files)
                }}
              />
            </div>
          </div>
        </div>
      </form>
      <TableComponent width={'150%'} tableHeaders={headers} tableData={formattedData} />

      {nextClick && (
        <InvoicePreviewPO
          open={nextClick}
          setNextClick={setNextClick}
          handleSave={handleSave}
          handleSubmit={handleSubmitBtn}
          saved={saved}
          formData={{
            ...getValues(),
            invoice_date: selectedDate?.format('YYYY-MM-DD HH:mm:ss'),
            attachment: uploadedFiles,
            purchaseOrderData: invoiceList
          }}
        />
      )}
      {showSuccessPopup && (
        <SuccessPopup
          open={showSuccessPopup}
          onClose={handleCloseSuccessPopup}
          successMsg="Invoice Created Successfully"
        />
      )}
    </LeftPageContainer>
  )
}

export default AddEditPOBasedComp
