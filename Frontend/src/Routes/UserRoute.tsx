import React from 'react'
import { Route,Routes } from "react-router-dom";
import Signup from "../Client/Signup/Signup";
import {ClientLoginPage} from "../../src/Client/Login/ClientLogin"
import Home from "../../src/Client/Home/Home"
import UserProfile from '@/Client/Profile/UserProfile';
import ClientLayout from '@/layout/clientLayout';
import ForgotPassword from '@/Client/Forgot Password/ForgotPassword';
import ResetPassword from '@/Client/Forgot Password/ResetPassword';



const UserRoute=()=>
{
    return(
        <Routes>
            <Route path="/signup" element={<Signup/>}></Route>
            <Route path="/login" element={<ClientLoginPage/>}></Route>
            <Route path="/" element={<Home/>}></Route>
            <Route path="/forgotpassword" element={<ForgotPassword/>}></Route>
            <Route path="/resetPassword/:token?" element={<ResetPassword/>}></Route>
            <Route element={<ClientLayout/>}>
            <Route path="/userProfile" element={<UserProfile/>}></Route>

            </Route>
            
        </Routes>
    )
}

export default UserRoute

