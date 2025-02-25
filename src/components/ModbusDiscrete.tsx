import { useState, useEffect, useCallback } from 'react'
import '.././styles/Coil.css'
// import '../styles/ReusableButton.css'
import ReusableButton from './ReusableButton'
interface DiscreteReadResponse {
  inputValues: Record<string, string>
}

const DiscreteDataFetch = () => {
  const [slaveId] = useState<number>(1)
  const [startAddress, setStartAddress] = useState<number>(0)
  const [count, setCount] = useState<number>(10)
  const [discreteData, setDiscreteData] = useState<Map<number, string> | null>(
    null
  )
  const [loading, setLoading] = useState<boolean>(false)
  const [discreteError, setDiscreteError] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] =
    useState<boolean>(true)
  const [, setSelectedAddress] = useState<number | null>(null) // Track selected address
  const [, setSelectedValue] = useState<string | null>(null) // Track selected value

  const MAX_ADDRESS = 50
  const SLAVE_ID = 1

  // Calculate dynamic max start address
  const maxStartAddress = MAX_ADDRESS - count

  const fectDiscreteData = useCallback(async () => {
    if (count < 1 || count > 50) {
      setDiscreteError('Coil count must be between 1 and 50.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/modbus/master/read-discrete-inputs?slaveId=${slaveId}&startAddress=${startAddress}&count=${count}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch discrete data')
      }

      const data: DiscreteReadResponse = await response.json()

      const inputValues = new Map<number, string>()
      for (let i = 0; i < count; i++) {
        inputValues.set(
          startAddress + i,
          data.inputValues[startAddress + i] || '0'
        )
      }

      setDiscreteData(inputValues)
      setDiscreteError(null) // Clear any previous errors
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError('Error fetching coil data')
      //setDiscreteData(null) // Reset coil data on error
    } finally {
      setLoading(false)
    }
  }, [slaveId, startAddress, count])

  // Auto-refresh effect
  useEffect(() => {
    fectDiscreteData()

    if (isAutoRefreshEnabled) {
      const interval = setInterval(() => {
        fectDiscreteData()
      }, 1000) // Refresh every 1 second

      return () => clearInterval(interval) // Cleanup on unmount
    }
  }, [fectDiscreteData, isAutoRefreshEnabled])

  // Click handler for table row
  const handleAddressClick = (clickedAddress: number, value: string) => {
    setSelectedAddress(clickedAddress)
    setSelectedValue(value) // Set the value associated with the clicked address
    console.log('Clicked Address:', clickedAddress, 'Value:', value)
  }

  return (
    <section className='container'>
      <div className='input-section'>
        <h2>Discrete Data</h2>
        <div className='inputs'>
          <label>Slave ID:</label>
          <input type='number' min={1} max={1} value={SLAVE_ID} disabled />
          <label>Start Address:</label>
          <input
            type='number'
            required
            min={0}
            max={maxStartAddress}
            value={startAddress}
            onChange={(e) => {
              const value = Number(e.target.value)
              if (value >= 0 && value <= maxStartAddress) {
                setStartAddress(value)
              } else {
                setStartAddress(maxStartAddress)
              }
            }}
          />
          <label>Discrete Count:</label>
          <input
            type='number'
            required
            min={1}
            max={MAX_ADDRESS - startAddress}
            value={count}
            onChange={(e) => {
              const value = Number(e.target.value)
              if (value >= 1 && value <= MAX_ADDRESS - startAddress) {
                setCount(value)
              } else {
                setStartAddress(maxStartAddress)
              }
            }}
          />
          {discreteError && (
            <p className='modbus-data__error'>{discreteError}</p>
          )}
          <ReusableButton
            onClick={() => setIsAutoRefreshEnabled(!isAutoRefreshEnabled)}
            label={
              isAutoRefreshEnabled ? 'Stop Auto-Refresh' : 'Start Auto-Refresh'
            }
            disabled={loading}
            className={
              isAutoRefreshEnabled ? 'auto-refresh-on' : 'auto-refresh-off'
            }
          />
        </div>
      </div>

      <div className='table-section'>
        <div className='coil-data-container'>
          <h3 className='display-fix'>Discrete Values:</h3>
          {!loading && error && (
            <div className='modbus-data__error-container'>
              <span className='error-icon'>⚠️</span>
              <p className='modbus-data__error'>Error: {error}</p>
            </div>
          )}
          {discreteData ? (
            <table>
              <tbody className='tbody coil-body'>
                {Array.from({ length: count }).map((_, index) => {
                  const address = startAddress + index
                  const value = discreteData.get(address) ?? 'Loading...'
                  const rowColor =
                    value === 'OFF'
                      ? 'red'
                      : value === 'ON'
                        ? 'green'
                        : 'transparent'

                  return (
                    <tr key={address} className='data-td'>
                      <td onClick={() => handleAddressClick(address, value)}>
                        {address}
                      </td>
                      <td style={{ backgroundColor: rowColor }}>{value}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          ) : (
            <p className='modbus-data__error'>No discrete data available.</p>
          )}
        </div>
      </div>
    </section>
  )
}

export default DiscreteDataFetch
