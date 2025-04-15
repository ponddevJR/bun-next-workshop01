"use client"

import Modal from "@/app/components/modal";
import config from "@/app/config";
import axios from "axios";
import React, { useEffect, useState } from "react"
import { FaPenAlt } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import Swal from "sweetalert2";

const ShopPage = () => {

    const [info,setInfo] = useState<{
        name:string,
            address:string,
            phone:string,
            email:string,
            facebookPage:string,
            tagCode:string
    }>({
            name:"",
            address:"",
            phone:"",
            email:"",
            facebookPage:"",
            tagCode:""
    });
    const [showModal,setShowModal] = useState<boolean>(false);
    const [isLoading,setIsLoading] = useState<boolean>(false);


    const getInfo = async () => {
        try {
            const res = await axios.get(`${config.apiURL}/api/shop/info`);
            setInfo(res?.data?.shop || {
                name:"",
                address:"",
                phone:"",
                email:"",
                facebookPage:"",
                tagCode:""
            })
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {getInfo()},[])
    
    const handleUpdate = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true)
        try {
            await axios.put(`${config.apiURL}/api/shop/update`,
                info
            )
            getInfo();
            Swal.fire("บันทึกข้อมูลแล้ว","","success");
            setShowModal(false);
        } catch (error) {
            console.error(error);
            Swal.fire("เกิดข้อผิดพลาด","โปรดลองอีกครั้ง","error");
        }finally{
            setIsLoading(false);
        }
    }

  return (
    <div className="card">
        <h1>ข้อมูลร้าน</h1>
        <button onClick={() => setShowModal(true)} className="btn-primary">
            <FaPenAlt/> แก้ไขข้อมูล
        </button>
        <div className="card-body mt-5">
            <div className="mt-4 p-3 bg-gray-700 text-gray-200">ชื่อร้าน : {info?.name || "ไม่พบข้อมูล" }</div>
            <div className="mt-4 p-3 bg-gray-700 text-gray-200">ที่อยู่ : {info?.address || "ไม่พบข้อมูล"}</div>
            <div className="mt-4 p-3 bg-gray-700 text-gray-200">เบอร์โทรศัพท์ : {info?.phone || "ไม่พบข้อมูล"}</div>
            <div className="mt-4 p-3 bg-gray-700 text-gray-200">อีเมล์ : {info?.email || "ไม่พบข้อมูล"}</div>
            <div className="mt-4 p-3 bg-gray-700 text-gray-200">Facebook : {info?.facebookPage || "ไม่พบข้อมูล"}</div>
            <div className="mt-4 p-3 bg-gray-700 text-gray-200">รหัสภาษี : {info?.tagCode || "ไม่พบข้อมูล"}</div>
        </div>

        <Modal
            isOpen={showModal}
            onClose={() => {
                setShowModal(false);
                getInfo();
            }}
            title="แก้ไขข้อมูลร้าน"
        >
            <form onSubmit={handleUpdate} className="flex flex-col">
            <div className="">ชื่อร้าน</div>
            <input 
                required
                type="text"
                placeholder="ชื่อร้าน"
                value={info?.name}
                name="name"
                className="form-control"
                onChange={(e:any) => setInfo({...info,[e.target.name]:e.target.value})}
            />

            <div className="mt-4">ที่อยู่</div>
            <input 
                required
                type="text"
                placeholder="กรอกที่อยู่"
                value={info.address}
                name="address"
                className="form-control"
                onChange={(e:any) => setInfo({...info,[e.target.name]:e.target.value})}
            />

            <div className="mt-4">เบอร์โทรศัพท์</div>
            <input 
                required
                type="tel"
                placeholder="เบอร์โทรศัพท์"
                value={info.phone}
                name="phone"
                className="form-control"
                onChange={(e:any) => setInfo({...info,[e.target.name]:e.target.value})}
            />

            <div className="mt-4">อีเมล์</div>
            <input 
                required
                type="text"
                placeholder="อีเมล์"
                value={info.email}
                name="email"
                className="form-control"
                onChange={(e:any) => setInfo({...info,[e.target.name]:e.target.value})}
            />

            <div className="mt-4">แฟนเพจ</div>
            <input 
                required
                type="string"
                placeholder="facebook-fanpage"
                value={info.facebookPage}
                name="facebookPage"
                className="form-control"
                onChange={(e:any) => setInfo({...info,[e.target.name]:e.target.value})}
            />

            <div className="mt-4">รหัสภาษี</div>
            <input 
                required
                type="string"
                placeholder="รหัสภาษี"
                value={info.tagCode}
                name="tagCode"
                className="form-control"
                onChange={(e:any) => setInfo({...info,[e.target.name]:e.target.value})}
            />

            <button disabled={isLoading} className="btn-primary">
                <FaCheck/> {isLoading ? "ดำเนินการ..." : "บันทึก"}
            </button>
            </form>
          
        </Modal>
    </div>
  )
}
export default ShopPage