import React from 'react'
import '.././styles/ReusableButton.css'
interface ButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
  label: string
  disabled?: boolean
  className?: string
  preventDefault?: boolean
}

const ReusableButton: React.FC<ButtonProps> = ({
  onClick,
  label,
  disabled = false,
  className,
  preventDefault = false, // Default to false
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (preventDefault) {
      e.preventDefault() // Call preventDefault if the prop is true
    }
    onClick(e) // Call the provided onClick handler
  }

  return (
    <button
      className={`btn ${className}`}
      onClick={handleClick} // Use the new handleClick function
      disabled={disabled}
    >
      {label}
    </button>
  )
}

export default ReusableButton
