import { Route,Routes } from "react-router-dom"
import AdminLogin from "@/Admin/AdminLogin"
import AdminLayout from "@/Admin/AdminLayout"
import Dashboard from "@/Admin/AdminDashboard"
import UserManagementPage from "@/Admin/UserManagement"
import VendorManagement from "@/Admin/vendors/VendorManagement"
import PendingVendors from "@/Admin/vendors/PendinVendors"



const AdminRoute=()=>
{
    return(
        <Routes>
            <Route path="login" element={<AdminLogin/>}></Route>
            <Route path="/" element={<AdminLayout/>}>
            <Route path="dashboard" element={<Dashboard/>} ></Route>
            <Route path="userManagement" element={<UserManagementPage/>} ></Route>
            <Route path="vendorManagement" element={<VendorManagement/>} ></Route>
            <Route path="pendingVendors" element={<PendingVendors/>} ></Route>
            </Route>
        </Routes>
    )
}

export default AdminRoute