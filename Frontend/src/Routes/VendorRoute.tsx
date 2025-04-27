import { Route,Routes } from "react-router-dom";
import VendorSignupPage from "@/Vendor/signup/VendorSignup";
import VendorLogin from "@/Vendor/login/VendorLogin";
import VendorDashboard from "@/Vendor/home/VendorDashboard";
import { VendorLayout } from "@/Vendor/sidebar/Sidebar";
import ChangePassword from "@/Vendor/changePassword/ChangePassword";



const VendorRoute=()=>{
    return(
        <Routes>
            <Route path="signup" element={<VendorSignupPage/>}></Route>
            <Route path="login" element={<VendorLogin/>}></Route>
            <Route  element={<VendorLayout/>}>
            
            <Route path="/home" element={<VendorDashboard/>}></Route>
            <Route path="/password" element={<ChangePassword/>}></Route>
            </Route>
            

        </Routes>
    )
}
export default VendorRoute