import { Route,Routes } from "react-router-dom";
import VendorSignupPage from "@/Vendor/signup/VendorSignup";
import VendorLogin from "@/Vendor/login/VendorLogin";
import VendorDashboard from "@/Vendor/home/VendorDashboard";
import { VendorLayout } from "@/Vendor/sidebar/Sidebar";
import ChangePassword from "@/Vendor/changePassword/ChangePassword";
import EventCreationForm from "@/Vendor/event/EventCreation";
import EventManagementPage from "@/Vendor/event/EventManagement";



const VendorRoute=()=>{
    return(
        <Routes>
            <Route path="signup" element={<VendorSignupPage/>}></Route>
            <Route path="login" element={<VendorLogin/>}></Route>
            <Route  element={<VendorLayout/>}>
            
            <Route path="/home" element={<VendorDashboard/>}></Route>
            <Route path="/password" element={<ChangePassword/>}></Route>
            <Route path="/addEvents" element={<EventCreationForm/>}></Route>
            <Route path="/manageEvents" element={<EventManagementPage/>}></Route>
            </Route>
            

        </Routes>
    )
}
export default VendorRoute