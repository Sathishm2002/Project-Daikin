import DateRangePicker from 'components/Common/DateRangePicker1'
import CustomModal from 'components/Common/Modal'
import React from 'react'
import styles from './EmailReport.module.scss'
import { NormalButton } from 'components/Common'
import { useTranslation } from 'react-i18next'
import { height } from '@mui/system'

const EmailReportComp = ({ open, onClose, value, setValue, onSend = () => {} }) => {
  const { t } = useTranslation('enquiries')

  const modalStyles = {
    maxWidth: '340px',
    minHeight:'200px',
    padding:'24px'
  }

  return (
    <div>
      <CustomModal
        open={open}
        onClose={onClose}
        title={t('emailReport.text')}
        closeIcon
        modalStyles={modalStyles}
        titleStyles={{ fontSize: '19px', fontWeight: '600', color: 'dimgrey', textAlign: 'start' }}>
        <div className={styles.emailReport}>
          <label className={styles.label}>Select Date</label>
          {/* <input
              type="date"
              id="date"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-blue-500"
            /> */}
          <DateRangePicker value={value} setValue={setValue} type="range" />
          <NormalButton
            onClick={onSend}
            isPrimary
            label="Send Report"
            customClass={styles.sendReportBtn}
          />
        </div>
      </CustomModal>
    </div>
  )
}

export default EmailReportComp
