import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import './App.css'
import UserRoute from './Routes/UserRoute'


function App() {
  

  return (
    <BrowserRouter>
    
    <Routes>
      <Route path='/*' element={<UserRoute/>}></Route>
     
      
    </Routes>
    
    </BrowserRouter>
  )
}

export default App
