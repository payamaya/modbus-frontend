import './App.css'
import ModbusCoil from './components/ModbusCoil.tsx'
import ModbusData from './components/ModbusData.tsx'
// import ModbusDataPost from './components/ModbusDataPost.tsx'
function App() {
  return (
    <>
      <h1>Modbus</h1>
      <ModbusData />
      {/* <ModbusDataPost apiUrl='http://localhost:8080/modbus/slave/write' /> */}
      {/* <ModbusTable
        apiUrl={import.meta.env.VITE_API_URL} // Make sure this points to the correct endpoint
        slaveId={1}
        address={0}
      /> */}
      <ModbusCoil />
    </>
  )
}

export default App
