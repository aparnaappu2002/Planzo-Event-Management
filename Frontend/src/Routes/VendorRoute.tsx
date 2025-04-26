import { Route,Routes } from "react-router-dom";
import VendorSignupPage from "@/Vendor/signup/VendorSignup";
import VendorLogin from "@/Vendor/signup/login/VendorLogin";




const VendorRoute=()=>{
    return(
        <Routes>
            <Route path="signup" element={<VendorSignupPage/>}></Route>
            <Route path="login" element={<VendorLogin/>}></Route>

        </Routes>
    )
}
export default VendorRoute