import axios from "axios";
import {showAlert} from "./alerts"
export const updateSettings=async(data,type)=>
{
    console.log("inside updatasettings")
    try{
        const url=type==="password"
        ?"http://127.0.0.1:3000/api/v1/users/updateMyPassword":
        "http://127.0.0.1:3000/api/v1/users/updateMe"
     const res=await axios({
         method:"PATCH",
         url:url,
         data
        })
        if(res.data.status==="success")
        {
            showAlert("Success",`${type.toUpperCase()} updated Successfully` );
        }
    }catch(err)
    {
     showAlert("Error",err.res.data.message)   
    }
}