import './App.css'
import Canvas from './components/Canvas'
import io from 'socket.io-client'

const socket = io.connect('http://localhost:3001')

function App() {

  function sendMessage() {
    // socket.emit()
  }

  return (
    <>
    {/* <button onClick={sendMessage}>hi</button> */}
      <Canvas />
    </>
  )
}

export default App
