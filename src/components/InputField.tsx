import React from 'react'
import '.././styles/InputField.css'
interface InputFieldProps {
  label: string
  type: string
  name: string
  value: number | ''
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  min?: number
  max?: number
  disabled?: boolean
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  name,
  value,
  onChange,
  min,
  max,
  disabled = false,
}) => {
  return (
    <div className='input-field'>
      <label>{label}:</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        disabled={disabled}
      />
    </div>
  )
}

export default InputField
