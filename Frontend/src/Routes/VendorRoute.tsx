import { Route,Routes } from "react-router-dom";
import VendorSignupPage from "@/Vendor/signup/VendorSignup";
import VendorLogin from "@/Vendor/login/VendorLogin";
import VendorDashboard from "@/Vendor/home/VendorDashboard";
import { VendorLayout } from "@/Vendor/sidebar/Sidebar";
import ChangePassword from "@/Vendor/changePassword/ChangePassword";
import EventCreationForm from "@/Vendor/event/EventCreation";
import EventManagementPage from "@/Vendor/event/EventManagement";
import ProtectedRouteVendor from "@/ProtectRoute/ProtectRouteVendor";
import ForgotPasswordVendor from "@/Vendor/ForgotPassword/ForgotPasswordVendor";
import ResetPasswordVendor from "@/Vendor/ForgotPassword/ResetPasswordVendor";



const VendorRoute=()=>{
    return(
        <Routes>
            <Route path="signup" element={<VendorSignupPage/>}></Route>
            <Route path="login" element={<VendorLogin/>}></Route>
            <Route path="/forgotpassword" element={<ForgotPasswordVendor/>}></Route>
            <Route path="/resetPassword/:token?" element={<ResetPasswordVendor/>}></Route>
            <Route path="/" element={<VendorLayout/>}>
            
            <Route path="/home" element={<ProtectedRouteVendor><VendorDashboard/></ProtectedRouteVendor> }></Route>
            <Route path="/password" element={<ProtectedRouteVendor> <ChangePassword/> </ProtectedRouteVendor>  }></Route>
            <Route path="/addEvents" element={<ProtectedRouteVendor><EventCreationForm/> </ProtectedRouteVendor> }></Route>
            <Route path="/manageEvents" element={<ProtectedRouteVendor> <EventManagementPage/> </ProtectedRouteVendor> }></Route>
            </Route>
            

        </Routes>
    )
}
export default VendorRoute