import { Route, Routes } from 'react-router-dom'
import './App.css'
import Signup from './pages/Signup/Signup'
import Login from './pages/Login/Login'

function App() {

  return (
    <>
    <Routes>
      <Route path="/" element={<Signup/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/signup" element={<Signup/>} />
      </Routes>
    </>
  )
}

export default App
