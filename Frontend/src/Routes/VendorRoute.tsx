import { Route,Routes } from "react-router-dom";
import VendorSignupPage from "@/Vendor/signup/VendorSignup";




const VendorRoute=()=>{
    return(
        <Routes>
            <Route path="signup" element={<VendorSignupPage/>}></Route>

        </Routes>
    )
}
export default VendorRoute