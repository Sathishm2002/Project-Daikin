import { useRef } from "react";
import './style.scss';

export const NormalButton = ({
  customClass = '',
  removeWidthConstraints = false,
  label = '',
  onClick,
  id,
  disabled = false,
  normal = false,
  isPrimary = false,
  sortButton = false,
  primary2 = false,
  outlineBtn = false,
  brandBtn = false,
  viewBtn = false,
  rightIcon = '',
  whiteBtn = false,
  outlineBtnRadius = false,
  leftIcon = '',
  addBtn = false,
  isLoading = false,
  removeBtn = false,
  green = false,
  secondary = false,
  btn100 = false,
  rightIconClassName = '',
  leftIconClassName = '',
  fullWidth,
  style,
  type,
  isFileUpload = false, // New prop to enable file upload
  onFileChange, // Callback function to handle file selection
  accept = '*', // File types allowed (default: all)
  multiple = false, // Allow multiple file selection
  fontFamily = 'inherit'
}) => {
  const fileInputRef = useRef(null)

  const handleButtonClick = (e) => {
    if (isFileUpload && fileInputRef.current) {
      fileInputRef.current.click() // Trigger file input click
    } else if (onClick) {
      onClick(e)
    }
  }

  const handleFileChange = (event) => {
    if (onFileChange) {
      onFileChange(event)
    }
  }

  return (
    <div className="button_custom">
      <button
        id={id}
        className={`btn cursor_pointer_arrow px-2
          ${fullWidth ? 'fullWidth' : ''}
          ${btn100 ? 'btn100' : ''}
          ${removeWidthConstraints ? 'normal-btn-custom-width' : ''}
          ${normal && !removeWidthConstraints ? 'normal-btn' : ''}
          ${whiteBtn ? 'white-btn' : ''}
          ${primary2 ? 'primary2-btn' : ''}
          ${isPrimary ? 'primary-btn' : ''}
          ${secondary ? 'secondary-btn' : ''}
          ${sortButton ? 'sortButton' : ''}
          ${outlineBtn ? 'outlineBtn' : ''}
          ${brandBtn ? 'brandBtn' : ''}
          ${viewBtn ? 'viewBtn' : ''}
          ${outlineBtnRadius ? 'outlineBtnRadius' : ''}
          ${removeBtn ? 'removeBtn' : ''}
          ${green ? 'green' : ''}
          ${customClass}`}
        onClick={handleButtonClick}
        disabled={disabled}
        type={type}
        style={{ ...style, fontFamily }}>
        {leftIcon !== '' && (
          <img
            style={{ marginInlineEnd: '0.5rem' }}
            className={`btn-right-icon ${leftIcon} ${leftIconClassName}`}
            src={leftIcon}
          />
        )}
        {label}
        {/* {isLoading ? <CircularProgress size={20} className="mx-2" /> : ""} */}
        {rightIcon !== '' && (
          <img
            style={{ marginInlineStart: '0.5rem' }}
            className={`btn-right-icon ${rightIcon} ${rightIconClassName}`}
            src={rightIcon}
          />
        )}

        {sortButton && (
          <span className="ml-3">{/* <img src={sortbuttonarrow} alt="arrow" /> */}</span>
        )}
      </button>

      {/* Hidden File Input */}
      {isFileUpload && (
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
          accept={accept}
          multiple={multiple}
        />
      )}
    </div>
  )
}
