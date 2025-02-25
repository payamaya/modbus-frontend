import React from 'react'

interface ButtonProps {
  onClick: () => void
  label: string
  disabled?: boolean
  className?: string
}

const ReusableButton: React.FC<ButtonProps> = ({
  onClick,
  label,
  disabled = false,
  className,
}) => {
  return (
    <button
      className={`btn ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  )
}

export default ReusableButton
