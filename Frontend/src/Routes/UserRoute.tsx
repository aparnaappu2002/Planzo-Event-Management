import React from 'react'
import { Route,Routes } from "react-router-dom";
import Signup from "../Client/Signup/Signup";
import {ClientLoginPage} from "../../src/Client/Login/ClientLogin"
import Home from "../../src/Client/Home/Home"




const UserRoute=()=>
{
    return(
        <Routes>
            <Route path="/signup" element={<Signup/>}></Route>
            <Route path="/login" element={<ClientLoginPage/>}></Route>
            <Route path="/" element={<Home/>}></Route>
        </Routes>
    )
}

export default UserRoute

