import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import './App.css'
import UserRoute from './Routes/UserRoute'
import VendorRoute from './Routes/VendorRoute'


function App() {
  

  return (
    <BrowserRouter>
    
    <Routes>
      <Route path='/*' element={<UserRoute/>}></Route>
      <Route path='/vendor/*' element={<VendorRoute/>}></Route>
     
      
    </Routes>
    
    </BrowserRouter>
  )
}

export default App
