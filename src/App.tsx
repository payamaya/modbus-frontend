import './App.css'
import ModbusCoil from './components/ModbusCoil.tsx'
import ModbusData from './components/ModbusData.tsx'
import ModbusDiscrete from './components/ModbusDiscrete.tsx'
import ModbusDataPost from './components/ModbusDataPost.tsx'
function App() {
  return (
    <>
      <h1>Modbus</h1>
      <ModbusData />
      <ModbusDataPost />
      <ModbusCoil />
      <ModbusDiscrete />
    </>
  )
}

export default App
