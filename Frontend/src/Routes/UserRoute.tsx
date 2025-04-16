import { Route,Routes } from "react-router-dom";
import Signup from "@/Client/Signup/Signup";




const UserRoute=()=>
{
    return(
        <Routes>
            <Route path="/signup" element={<Signup/>}></Route>
        </Routes>
    )
}

export default UserRoute

