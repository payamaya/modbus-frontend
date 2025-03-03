import { useEffect, useState } from 'react'
import ReusableButton from './ReusableButton'
import InputField from './InputField'

const ModbusDataPost = () => {
  const [slaveId] = useState<number>(1)
  const [startAddress, setAddress] = useState<number | ''>('')
  const [registerValue, setValue] = useState<number | ''>('')
  const [responseMessage, setResponseMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Constants for validation
  const MIN_ADDRESS = 0 // Minimum allowed startAddress
  const MAX_ADDRESS = 200 // Maximum allowed startAddress (adjust as needed)

  useEffect(() => {
    if (responseMessage) {
      const timer = setTimeout(() => {
        setResponseMessage(null)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [responseMessage])

  const sendData = async () => {
    // Validate inputs
    if (startAddress === '' || registerValue === '') {
      setError('All fields (Address and Value) are required.')
      return
    }
    if (startAddress < MIN_ADDRESS || startAddress > MAX_ADDRESS) {
      setError(`Address must be between ${MIN_ADDRESS} and ${MAX_ADDRESS}.`)
      return
    }
    if (registerValue < 0) {
      setError('Register value cannot be negative.')
      return
    }
    setLoading(true)
    setError(null)

    try {
      // Construct the URL with query parameters
      const apiUrl = `${import.meta.env.VITE_API_URL}/modbus/slave/write-single?slaveId=${slaveId}&startAddress=${startAddress}&registerValue=${registerValue}`
      console.log('API URL:', apiUrl) // Log the URL for debugging

      const response = await fetch(apiUrl, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`)
      }

      // Parse the response as JSON
      const result = await response.text()
      console.log('API Response:', result)

      // Set a custom success message
      setResponseMessage('Data sent successfully')
      setAddress('')
      setValue('')
    } catch (err) {
      console.error('Error sending data:', err)
      if (err instanceof TypeError && err.message === 'Failed to fetch') {
        setError(
          'Failed to connect to the server. Please check your network or backend server.'
        )
      } else {
        setError(
          `Failed to send data: ${err instanceof Error ? err.message : 'Unknown error'}`
        )
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='container'>
      <div className='input-section'>
        <h2>Modbus Data Writer</h2>
        <div className='inputs'>
          <InputField
            label={'Slave ID:'}
            type={'number'}
            name={'slaveId'}
            value={slaveId}
            onChange={() => {}}
            disabled
            max={1}
          />
          <InputField
            label={'Address:'}
            type={'number'}
            name={'startAddress'}
            value={startAddress}
            onChange={(e) => {
              const value = e.target.value !== '' ? Number(e.target.value) : ''
              setAddress(value)
              setError(null)
            }}
            min={MIN_ADDRESS}
            max={MAX_ADDRESS}
          />
          <InputField
            label={'Value'}
            type={'number'}
            name={'registerValue'}
            value={registerValue}
            onChange={(e) => {
              const value = e.target.value ? Number(e.target.value) : ''
              if (value === '' || value >= 0) {
                setValue(value)
                setError(null)
              }
            }}
            min={0}
          />
        </div>
        <ReusableButton
          onClick={sendData}
          className='modbus-data__button'
          label='Send Data'
        />
        <section className='error-section'>
          {loading && <p className='loader'></p>}
          {error && <p className='error-msg'>{error}</p>}
          {responseMessage && <p className='error-msg'>{responseMessage}</p>}
        </section>
      </div>
    </div>
  )
}

export default ModbusDataPost
