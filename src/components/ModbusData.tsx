import { useEffect, useState, useCallback } from 'react'
import '.././styles/Coil.css' // Reuse the same CSS for consistency
import ReusableButton from './ReusableButton'
import '../styles/Error.css'
const ModbusData = () => {
  const [startAddress, setAddress] = useState<number>(0) // Required, default to 0
  const [count, setNumRegisters] = useState<number>(10) // Required, default to 1
  const [data, setData] = useState<number[] | null>(null) // Store fetched data directly as an array
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [registersError, setRegistersError] = useState<string | null>(null) // For count error
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null) // Store clicked startAddress
  const [selectedValue, setSelectedValue] = useState<number | null>(null) // Store the value of the clicked startAddress
  const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] =
    useState<boolean>(true) // Auto-refresh toggle

  const SLAVE_ID = 1 // Fixed at 1
  const MAX_ADDRESS = 200 // Maximum startAddress limit

  // Calculate dynamic max start startAddress
  const maxStartAddress = MAX_ADDRESS - count

  // Memoized fetchData function
  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    setRegistersError(null) // Reset error message

    // Validation for number of registers
    if (count < 1 || count > MAX_ADDRESS) {
      setRegistersError(
        `The number of registers must be between 1 and ${MAX_ADDRESS}.`
      )
      setLoading(false)
      return
    }

    // Validation for startAddress
    if (startAddress < 0 || startAddress > maxStartAddress) {
      setRegistersError(`Address must be between 0 and ${maxStartAddress}.`)
      setLoading(false)
      return
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/modbus/master/read-registers?slaveId=${SLAVE_ID}&startAddress=${startAddress}&count=${count}`
      )
      console.log(
        `Fetching: ${import.meta.env.VITE_API_URL}/modbus/master/read-registers?slaveId=${SLAVE_ID}&startAddress=${startAddress}&count=${count}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch data')
      }

      const result = await response.json()
      console.log('API Response:', result)

      if (Array.isArray(result.registerValues)) {
        setData(result.registerValues)
      } else {
        throw new Error('Invalid data structure returned from the API')
      }
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }, [startAddress, count, maxStartAddress, SLAVE_ID])

  useEffect(() => {
    // Fetch data initially when the component mounts
    fetchData()

    if (isAutoRefreshEnabled) {
      const interval = setInterval(() => {
        fetchData()
      }, 1500) // Refresh every 4 seconds

      return () => clearInterval(interval) // Cleanup on unmount
    }
  }, [fetchData, isAutoRefreshEnabled])

  useEffect(() => {
    if (selectedAddress !== null && data) {
      const index = selectedAddress - startAddress
      if (index >= 0 && index < data.length) {
        setSelectedValue(data[index]) // Update selectedValue
      } else {
        setSelectedValue(null) // Reset if selectedAddress is out of range
      }
    }
  }, [data, selectedAddress, startAddress])
  // Click handler for table row
  const handleAddressClick = (clickedAddress: number, value: number) => {
    setSelectedAddress(clickedAddress)
    setSelectedValue(value) // Set the value associated with the clicked startAddress
    console.log('Clicked Address:', clickedAddress, 'Value:', value)
  }

  return (
    <section className='container'>
      <div className='input-section'>
        <h2>Modbus Master Call a Slave</h2>
        <div className='inputs'>
          <label>Slave ID:</label>
          <input type='number' min={1} max={1} value={SLAVE_ID} disabled />
          <label>Address:</label>
          <input
            type='number'
            min={0}
            max={maxStartAddress} // Limit startAddress dynamically
            required
            value={startAddress}
            onChange={(e) => {
              const value = Number(e.target.value)
              if (value >= 0 && value <= maxStartAddress) {
                setAddress(value)
                setRegistersError(null) // Clear error on valid input
              }
            }}
          />
          <label>Num of Registers:</label>
          <input
            type='number'
            min={1}
            max={124} // Backend limit
            step='1'
            required
            value={count}
            onChange={(e) => {
              const value = Number(e.target.value)
              if (value >= 1 && value <= 124) {
                setNumRegisters(value)
                setRegistersError(null) // Clear error on valid input
              }
            }}
          />
          {registersError && (
            <p className='modbus-data__error'>{registersError}</p>
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
        {data && (
          <div className='coil-data-container'>
            <table>
              <thead>
                <h3 className='display-fix'>
                  Register Values: <br />
                  {selectedAddress === null && selectedValue === null && (
                    <span className='instruction-text'>
                      Click on an startAddress to see details.
                    </span>
                  )}
                </h3>
              </thead>
              <tbody className='tbody coil-body'>
                {data.map((value, index) => {
                  const rowAddress = Number(startAddress) + index
                  return (
                    <tr key={rowAddress}>
                      <td
                        className='data-td clickable' // Add a CSS class for styling
                        onClick={() => handleAddressClick(rowAddress, value)}
                      >
                        {rowAddress}
                      </td>
                      {/* <td className='data-td'>{value}</td> */}
                    </tr>
                  )
                })}
                {/* Conditionally render the selected startAddress and value */}
              </tbody>
              <tfoot>
                {selectedAddress !== null && selectedValue !== null && (
                  <tr className='selected-startAddress fix'>
                    <td className='tfoot-td'>
                      Address: <strong>{selectedAddress}</strong>
                      <br />
                    </td>
                    <td className='tfoot-td'>
                      Value: <strong>{selectedValue}</strong>
                      <br />
                    </td>
                  </tr>
                )}
              </tfoot>
              {!loading && error && (
                <div className='modbus-data__error-container'>
                  <span className='error-icon'>⚠️</span>
                  <p className='modbus-data__error'>Error: {error}</p>
                </div>
              )}
            </table>
          </div>
        )}
      </div>
    </section>
  )
}

export default ModbusData
