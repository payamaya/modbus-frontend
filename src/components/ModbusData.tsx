import { useState } from 'react'

const ModbusData = () => {
  const [slaveId, setSlaveId] = useState<number | ''>('')
  const [address, setAddress] = useState<number | ''>('')
  const [data, setData] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    if (slaveId === '' || address === '') {
      setError('Both Slave ID and Address are required')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const response = await fetch(
        `http://localhost:8080/modbus/master/read?slaveId=${slaveId}&address=${address}`
      )
      const result = await response.text()
      setData(result)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError('Failed to fetch data')
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
          step='1'
          value={slaveId}
          onChange={(e) =>
            setSlaveId(e.target.value ? Number(e.target.value) : '')
          }
          className='modbus-data__input'
        />
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
              <th className='modbus-data__table-header'>Slave ID</th>
              <th className='modbus-data__table-header'>Address</th>
              <th className='modbus-data__table-header'>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className='modbus-data__table-cell'>{slaveId}</td>
              <td className='modbus-data__table-cell'>{address}</td>
              <td className='modbus-data__table-cell'>
                {data.replace('Register value: ', '')}
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  )
}

export default ModbusData
