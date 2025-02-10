// import { useState } from 'react'

// // Reusable Input Component
// const ModbusInput = ({
//   label,
//   name,
//   value,
//   onChange,
// }: {
//   label: string
//   name: string
//   value: number | ''
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
// }) => (
//   <div className='modbus-input'>
//     <label className='modbus-data__label'>{label}:</label>
//     <input
//       type='number'
//       min='0'
//       step='1'
//       name={name}
//       value={value}
//       onChange={onChange}
//       className='modbus-data__input'
//     />
//   </div>
// )

// const ModbusDataPost = ({
//   apiUrl = 'http://localhost:8080/modbus/slave/write',
// }) => {
//   // Use a single state object for form fields
//   const [formData, setFormData] = useState({
//     slaveId: '' as number | '',
//     address: '' as number | '',
//     value: '' as number | '',
//   })
//   const [responseMessage, setResponseMessage] = useState<string | null>(null)
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)

//   // Handle form input changes dynamically
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value ? Number(e.target.value) : '',
//     })
//   }

//   // Function to send Modbus data
//   const sendData = async () => {
//     if (!formData.slaveId || !formData.address || !formData.value) {
//       setError('All fields (Slave ID, Address, and Value) are required')
//       return
//     }

//     setLoading(true)
//     setError(null)

//     try {
//       const requestData = {
//         slaveId: formData.slaveId,
//         address: formData.address,
//         value: formData.value,
//       }

//       const response = await fetch(apiUrl, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json', // Ensure backend accepts JSON
//         },
//         body: JSON.stringify(requestData), // Send data in body as JSON
//       })

//       console.log('Response status:', response.status)

//       if (!response.ok) {
//         // If the response isn't OK, show an error
//         setError(
//           'Failed to send data. Server responded with status: ' +
//             response.status
//         )
//         return
//       }

//       const result = await response.json() // Parse response as JSON

//       console.log('Response data:', result)

//       if (result.error) {
//         setError(result.error) // Handle any error from the backend
//       } else {
//         setResponseMessage('Data written successfully!')
//       }
//     } catch (err) {
//       console.error('Fetch error:', err)
//       setError('Failed to send data')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className='modbus-data'>
//       <h2 className='modbus-data__title'>Modbus Data Writer</h2>
//       <div className='modbus-data__controls'>
//         <ModbusInput
//           label='Slave ID'
//           name='slaveId'
//           value={formData.slaveId}
//           onChange={handleChange}
//         />
//         <ModbusInput
//           label='Address'
//           name='address'
//           value={formData.address}
//           onChange={handleChange}
//         />
//         <ModbusInput
//           label='Value'
//           name='value'
//           value={formData.value}
//           onChange={handleChange}
//         />

//         <button onClick={sendData} className='modbus-data__button'>
//           Send Data
//         </button>
//       </div>

//       {loading && <p className='modbus-data__loading'>Loading...</p>}
//       {error && <p className='modbus-data__error'>{error}</p>}
//       {responseMessage && (
//         <p className='modbus-data__success'>{responseMessage}</p>
//       )}
//     </div>
//   )
// }

// export default ModbusDataPost
