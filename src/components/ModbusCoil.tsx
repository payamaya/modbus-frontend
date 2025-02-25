import { useState, useEffect, useCallback } from 'react'
import '.././styles/Coil.css'

interface CoilReadResponse {
  coilValues: Record<string, string>
}

const CoilDataFetch = () => {
  const [slaveId] = useState<number>(1)
  const [startAddress, setStartAddress] = useState<number>(0)
  const [count, setCount] = useState<number>(10)
  const [coilData, setCoilData] = useState<Map<number, string> | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [coilError, setCoilError] = useState<string | null>(null)
  const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] =
    useState<boolean>(true)
  const [, setSelectedAddress] = useState<number | null>(null) // Track selected address
  const [, setSelectedValue] = useState<string | null>(null) // Track selected value

  const MAX_ADDRESS = 50
  const SLAVE_ID = 1

  // Calculate dynamic max start address
  const maxStartAddress = MAX_ADDRESS - count

  const fetchCoilData = useCallback(async () => {
    if (count < 1 || count > 50) {
      setCoilError('Coil count must be between 1 and 50.')
      return
    }

    setLoading(true)
    setCoilError(null)
    setCoilData(null)

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/modbus/master/read-coils?slaveId=${slaveId}&startAddress=${startAddress}&count=${count}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch coil data')
      }

      const data: CoilReadResponse = await response.json()

      const coilValues = new Map<number, string>()
      for (let i = 0; i < count; i++) {
        coilValues.set(
          startAddress + i,
          data.coilValues[startAddress + i] || '0'
        )
      }

      setCoilData(coilValues)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setCoilError('Error fetching coil data')
    } finally {
      setLoading(false)
    }
  }, [slaveId, startAddress, count])

  // Auto-refresh effect
  useEffect(() => {
    fetchCoilData()

    if (isAutoRefreshEnabled) {
      const interval = setInterval(() => {
        fetchCoilData()
      }, 1000) // Refresh every 3 seconds

      return () => clearInterval(interval) // Cleanup on unmount
    }
  }, [fetchCoilData, isAutoRefreshEnabled])

  // Click handler for table row
  const handleAddressClick = (clickedAddress: number, value: string) => {
    setSelectedAddress(clickedAddress)
    setSelectedValue(value) // Set the value associated with the clicked address
    console.log('Clicked Address:', clickedAddress, 'Value:', value)
  }

  return (
    <section className='container'>
      <div className='input-section'>
        <h2>Coil Data</h2>
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
          <label>Coil Count:</label>
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
          {coilError && <p className='modbus-data__error'>{coilError}</p>}
          <button
            className={`fetch-coil ${isAutoRefreshEnabled ? 'auto-refresh-on' : 'auto-refresh-off'}`}
            onClick={() => {
              if (isAutoRefreshEnabled) {
                setIsAutoRefreshEnabled(false) // Stop auto-refresh if active
              } else {
                setIsAutoRefreshEnabled(true) // Enable auto-refresh
              }
            }}
            disabled={loading}
          >
            {loading
              ? 'Loading...'
              : isAutoRefreshEnabled
                ? 'Stop Auto-Refresh'
                : 'Start Auto-Refresh'}
          </button>
        </div>
      </div>

      <div className='table-section'>
        {coilData && (
          <div className='coil-data-container'>
            <table>
              <thead>
                <h3 className='display-fix'>Coil Values:</h3>
              </thead>
              <tbody className='tbody coil-body'>
                {Array.from({ length: Math.max(10, count) }).map((_, index) => {
                  const address = startAddress + index
                  const value = coilData?.get(address) ?? 'Loading...'
                  const rowColor =
                    value === 'OFF'
                      ? 'red'
                      : value === 'ON'
                        ? 'green'
                        : 'transparent'

                  return (
                    <tr key={address} className='data-td'>
                      <td
                        className=' clickable'
                        onClick={() => handleAddressClick(address, value)}
                      >
                        {address}
                      </td>
                      <td style={{ backgroundColor: rowColor }}>{value}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <div>
              {coilError && <p className='modbus-data__error'>{coilError}</p>}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default CoilDataFetch
