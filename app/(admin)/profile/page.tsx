"use client";

import axios from "axios";
import  config  from "../../config";
import { useState } from "react"
import { FaCheck } from "react-icons/fa6"
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const ProfilePage = () => {

    const redirect = useRouter();
    const [username,setUsername] = useState<string>("");
    const [password,setPassword] = useState<string>("");
    const [confirmPass,setConfirmPass] = useState<string>("");

    const handleSave = async () => {
        if(username === "")
            return Swal.fire("เกิดข้อผิดพลาด","กรุณาระบุ username","error");

        if(password !== "" && confirmPass !== ""){
            if(password !== confirmPass)return Swal.fire("้เกิดข้อผิดพลาด","รหัสผ่านไม่ถูกต้อง","error");
        }

        const headers = {
            'Authorization' : `Bearer ${localStorage.getItem(config.tokenKey)}`
        };

        try {
            const res = await axios.put(`${config.apiURL}/api/user/update`,{username,password},{headers:headers});
            if(res?.data?.status === 200){
                Swal.fire("บันทึกข้อมูลแล้ว","","success");
            }
            setUsername("");
            setPassword("");
            setConfirmPass("");
            redirect.push("/dashboard");
        } catch (error:any) {
            console.error(error);
            Swal.fire("เกิดข้อผิดพลาด","ไม่สามารถบันทึกข้อมูลได้","error");
        }
    }

  return (
    <div className="card">
        <h1>
            Profile
        </h1>
        <div className="card-body">
            <div className="">Username</div>
            <input value={username} onChange={(e:any) => setUsername(e.target.value)} type="text" className="form-control"/>

            <div className="mt-5">Password (หากไม่ต้องการเปลี่ยนให้ว่าง)</div>
            <input value={password} onChange={(e:any) => setPassword(e.target.value)} type="password" className="form-control" />

            <div className="mt-5">ยืนยัน Password (หากไม่ต้องการเปลี่ยนให้ว่าง)</div>
            <input value={confirmPass} onChange={(e:any) => setConfirmPass(e.target.value)} type="password" className="form-control" />

            <button onClick={handleSave} className="btn-primary rounded-lg">
                <FaCheck/> บันทึก
            </button>
        </div>
    </div>
  )
}
export default ProfilePage