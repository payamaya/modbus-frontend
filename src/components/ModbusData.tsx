import { useState } from 'react'

const ModbusData = () => {
  const [slaveId, setSlaveId] = useState<number | ''>('')
  const [address, setAddress] = useState<number | ''>('')
  const [numRegisters, setNumRegisters] = useState<number | ''>('') // Number of registers
  const [data, setData] = useState<number[] | null>(null) // Store fetched data directly as an array
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [registersError, setRegistersError] = useState<string | null>(null) // For numRegisters error
  const [slaveIdError, setSlaveIdError] = useState<string | null>(null) // For slaveId error

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    setRegistersError(null) // Reset the registers error message
    setSlaveIdError(null) // Reset the slave ID error message

    // Validation for number of registers
    if (numRegisters && numRegisters > 10) {
      setRegistersError('The number of registers cannot be more than 10.')
      setLoading(false)
      return
    }

    // Validation for slave ID (it must be 1)
    if (slaveId && slaveId !== 1) {
      setSlaveIdError('Slave ID must be 1.')
      setLoading(false)
      return
    }

    try {
      // Ensure numRegisters does not exceed 10
      const registersToFetch =
        numRegisters && numRegisters <= 10 ? numRegisters : 10

      // Adjust the URL to include slaveId, address, and numRegisters
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/modbus/master/read?slaveId=${slaveId}&address=${address}&numRegisters=${registersToFetch}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch data')
      }

      const result = await response.json()

      // Log the result to check the structure
      console.log(result)

      if (Array.isArray(result.values)) {
        // Store the values directly into state
        setData(result.values)
      } else {
        throw new Error('Invalid data structure returned from the API')
      }
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='modbus-data'>
      <h2 className='modbus-data__title'>Modbus Data Viewer</h2>
      <div className='modbus-data__controls'>
        <label className='modbus-data__label'>Slave ID:</label>
        <input
          type='number'
          min='1'
          max='1' // Restricting slave ID to 1
          value={slaveId}
          onChange={(e) =>
            setSlaveId(e.target.value ? Number(e.target.value) : '')
          }
          className='modbus-data__input'
        />
        {slaveIdError && <p className='modbus-data__error'>{slaveIdError}</p>}{' '}
        {/* Show error if slaveId is not 1 */}
        <label className='modbus-data__label'>Address:</label>
        <input
          type='number'
          min='1'
          step='1'
          value={address}
          onChange={(e) =>
            setAddress(e.target.value ? Number(e.target.value) : '')
          }
          className='modbus-data__input'
        />
        <label className='modbus-data__label'>Num of Reg:</label>
        <input
          type='number'
          min='1'
          max='10' // Ensures no more than 10 registers can be entered
          step='1'
          value={numRegisters}
          onChange={(e) =>
            setNumRegisters(e.target.value ? Number(e.target.value) : '')
          }
          className='modbus-data__input'
        />
        {registersError && (
          <p className='modbus-data__error'>{registersError}</p>
        )}{' '}
        {/* Display the error message for numRegisters */}
        <button onClick={fetchData} className='modbus-data__button'>
          Fetch Data
        </button>
      </div>

      {loading && <p className='modbus-data__loading'>Loading...</p>}
      {error && <p className='modbus-data__error'>{error}</p>}

      {data && (
        <table className='modbus-data__table'>
          <thead>
            <tr>
              <th className='modbus-data__table-header'>Register ID:</th>
              {data.map((_, idx) => (
                <th key={idx} className='modbus-data__table-header'>
                  Num of Reg {Number(address) + idx}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className='modbus-data__table-cell'>{address}</td>
              {data.map((value, idx) => (
                <td key={idx} className='modbus-data__table-cell'>
                  {value}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      )}
    </div>
  )
}

export default ModbusData
