"use client";

import Modal from "@/app/components/modal";
import config from "@/app/config";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { FaSave } from "react-icons/fa";
import { FaPen, FaPlus, FaTrash } from "react-icons/fa6";
import Swal from "sweetalert2";

const DevicePage = () => {

    const [devices,setDevices] = useState<[]>([]);
    const [showModal,setShowModal] = useState<boolean>(false);
    const [barcode,setBarcode] = useState<string>("");
    const [serial,setSerial] = useState<string>("");
    const [name,setName] = useState<string>("");
    const [expireDate,setExpireDate] = useState<string>("");
    const [remark,setRemark] = useState<string>("");
    const [id,setId] = useState<number>(0);
    const [isLoading,setIsLoading] = useState<boolean>(false);

    const getDevices = async () => {
        try {
            const res = await axios.get(`${config.apiURL}/api/device/list`);
            setDevices(res?.data?.devices);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getDevices();
    },[]);

    const handleCloseModal = () => {
        setShowModal(false);
        setBarcode("");
        setExpireDate("");
        setId(0);
        setName("");
        setRemark("");
        setSerial("");

    }
    const handleShowModal = () => setShowModal(true);

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const payload = {
                barcode,serial,name,expireDate:new Date(expireDate),remark
            }

            if(id === 0){
                await axios.post(`${config.apiURL}/api/device/create`,payload);
            }else{
                await axios.put(`${config.apiURL}/api/device/update/${id}`,payload)
            }

            setShowModal(false);
            setBarcode("");
            setExpireDate("");
            setId(0);
            setName("");
            setRemark("");
            setSerial("");

            getDevices();
        } catch (error) {
            console.error(error);
            Swal.fire("เกิดข้อผิดพลาด","โปรดลองอีกครั้ง","error");
        }finally{
            setIsLoading(false);
        }
    }

    const handleEdit = async (item:any) => {
        setId(item.id);
        setBarcode(item.barcode);
        setSerial(item.serial);
        setName(item.name);
        setExpireDate(item.expireDate);
        setRemark(item.remark);

        setShowModal(true);
    }

    const handleRemove = async (id:string) => {
        try {
            const {isConfirmed} = await config.confirmDialog();
            if(isConfirmed){
                await axios.delete(`${config.apiURL}/api/device/remove/${id}`);
                getDevices();
            }
        } catch (error) {
            console.error(error);
            Swal.fire("เกิดข้อผิดพลาด","โปรดลองอีกครั้ง","error");
        }
    }

  return (
    <div className="card">
        <h1 className="">
            ทะเบียนวัสดุ อุปกรณ์
        </h1>
        <div className="card-body">
            <button onClick={handleShowModal} className="btn-primary">
                <FaPlus/> เพิ่มข้อมูล
            </button>

            <table className="table">
                <thead>
                    <tr>
                        <th>ชื่อวัสดุ</th>
                        <th>barcode</th>
                        <th>serial</th>
                        <th>วันหมดอายุ</th>
                        <th>หมายเหตุ</th>
                        <th>แอคชัน</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        devices.map((item:any,index:number) => {
                            return (
                                <tr className="bg-gray-600" key={index}>
                                    <td>{item?.name}</td>
                                    <td>{item?.barcode}</td>
                                    <td>{item?.serial}</td>
                                    <td>{dayjs(item?.expireDate).format("DD/MM/YYY")}</td>
                                    <td>{item?.remark}</td>
                                    <td style={{width:"100px"}}>
                                        <div className="flex items-center ">
                                            <button className="btn-edit" onClick={() => handleEdit(item)}>
                                                <FaPen/>
                                            </button>
                                            <button className="btn-delete" onClick={() => handleRemove(item?.id)}>
                                                <FaTrash/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>

        <Modal 
            title="ทะเบียนวัสดุ อุปกรณ์" 
            isOpen={showModal}
            onClose={handleCloseModal}
            >
                <div className="mt-3">Barcode</div>
                <input type="text" 
                    value={barcode} 
                    onChange={(e:any) => setBarcode(e.target.value)}
                    className="form-control"
                    placeholder="บาร์โค้ด"
                />

                <div className="mt-3">Serial</div>
                <input type="text" 
                    value={serial} 
                    onChange={(e:any) => setSerial(e.target.value)}
                    className="form-control"
                    placeholder="serial"
                />

                <div className="mt-3">ชื่อวัสดุ อุปกรณ์</div>
                <input type="text" 
                    value={name} 
                    onChange={(e:any) => setName(e.target.value)}
                    className="form-control"
                    placeholder="ชื่อ"
                />

                <div className="mt-3">วันที่หมดอายุ</div>
                <input type="date" 
                    value={expireDate} 
                    onChange={(e:any) => setExpireDate(e.target.value)}
                    className="form-control"
                    placeholder="ว/ด/ป"
                />

                <div className="mt-3">หมายเหตุ</div>
                <input type="text" 
                    value={remark} 
                    onChange={(e:any) => setRemark(e.target.value)}
                    className="form-control"
                    placeholder="ระบุหมายเหตุ"
                />

                <button disabled={isLoading} className="btn btn-primary mt-3" onClick={handleSave}>
                    <FaSave/> {isLoading ? "กำลังดำเนินการ..." : "บันทึกข้อมูล"}
                </button>
        </Modal>
    </div>
  )
}
export default DevicePage