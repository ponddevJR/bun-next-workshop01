"use client";

import Modal from "@/app/components/modal";
import config from "@/app/config";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { FaCheck, FaPen, FaPlus, FaTrash } from "react-icons/fa6";
import Swal from "sweetalert2";

type RepairFormData = {
  customerName: string;
  customerPhone: string;
  poblem: string;
  deviceId: string;
  deviceName: string;
  deviceSerial: string;
  deviceBarcode: string;
  userId: string;
};

type repairRecordsType = {
  id: number;
  customerName: string;
  customerPhone: string;
  device: { id: number; name: string };
  user: { id: number; username: string };
  poblem: string;
  imageBeforeRepair: string;
  imageAfterRepair: string;
  createdAt: Date;
  endJobDate: Date;
  amount:number,
  status:string,
};

const RepairRecord = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("เพิ่มการซ่อม");
  const [repairData, setRepairData] = useState<RepairFormData>({
    customerName: "",
    customerPhone: "",
    deviceId: "0",
    poblem: "",
    userId: "",
    deviceName: "",
    deviceBarcode: "",
    deviceSerial: "",
  });
  const [devices, setDevices] = useState<{ id: number; name: string }[]>([]);
  const [previewImg, setPreviewImg] = useState<string>("");
  const [imageBeforeRepair, setImageBeforeRepair] = useState<{name:string,type:string}>({
    name:"",type:""
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [repairRecords, setRepairRecords] = useState<repairRecordsType[]>([]);
  const [editId,setEditId] = useState<number>(0);
  const [oldImg,setOldImg] = useState<string>("");

  const [showModalReceive,setModalReceive] = useState<boolean>(false);
  const [receiveData,setReceiveData] = useState<
    {
      customerName:string,amount:number,recordId:string
    }
  >({customerName:"",amount:0,recordId:""});

    const openModalReciece = (item:any) => {
      console.log("🚀 ~ openModalReciece ~ item:", item)
      setModalReceive(true);
      setReceiveData({
        customerName:item?.customerName,
        amount:item?.amount || 0,recordId:item?.id
      })
    }

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleRecive = async () => {
    setIsLoading(true);
    try {
      const res = await axios.put(`${config.apiURL}/api/repair-record/receivce/${receiveData.recordId}`,{
        amount:receiveData.amount
      })
      if(res?.data?.err)return Swal.fire("เกิดข้อผิดพลาด",res?.data?.err,"error");

      Swal.fire("บันทึกข้อมูลแล้ว","","success");
      getRepairRecords();
      setModalReceive(false);
    } catch (error) {
      console.error(error);
      Swal.fire("เกิดข้อผิดพลาด","โปรดลอใหม่อีกครั้ง","error");
    }finally{
      setIsLoading(false);
    }
  }

  const handleShowModal = () => setShowModal(true);

  useEffect(() => {
    getDevices();
    getRepairRecords();
  }, []);

  const getDevices = async () => {
    try {
      const res = await axios.get(`${config.apiURL}/api/device/list`);
      setDevices(res?.data?.devices);
    } catch (error) {
      console.error(error);
    }
  };

  const getRepairRecords = async () => {
    try {
      const repairRecords = await axios.get(
        `${config.apiURL}/api/repair-record/list`
      );
      setRepairRecords(repairRecords?.data?.repairRecords);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (item: repairRecordsType) => {
    setOldImg(item?.imageBeforeRepair);
    setEditId(item?.id);
    setModalTitle("แก้ไขข้อมูลการซ่อม")
    setPreviewImg(config.apiURL+'/api/uploads/'+item?.imageBeforeRepair);
    setRepairData({
        customerName:item?.customerName,
        customerPhone:item?.customerPhone,
        deviceId:String(item?.device?.id),
        poblem:item?.poblem,
        userId:String(item?.user?.id),
        deviceBarcode:"",
        deviceName:"",
        deviceSerial:""
    })
    setShowModal(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const payload = { ...repairData };
      const formData = new FormData();
      for (const key in payload) {
        formData.append(key, (payload as any)[key].toString());
      }
      formData.append("image", imageBeforeRepair as File);

      let res;
      if(editId == 0){
        res = await axios.post(
          `${config.apiURL}/api/repair-record/create`,
          formData,
          {
            headers: {
              "Content-type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem(config.tokenKey)}`,
            },
          }
        );
      }else{
        
          formData.append("oldImg",oldImg)
        res = await axios.put(
          `${config.apiURL}/api/repair-record/update/${editId}`,
          formData,
          {
            headers: {
              "Content-type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem(config.tokenKey)}`,
            },
          }
        );
      }
      if (res?.data?.err)
        return Swal.fire("เกิดข้อผิดพลาด", res?.data?.err, "error");
      setShowModal(false);
      setRepairData({
        customerName:"",
        customerPhone:"",
        deviceBarcode:"",
        deviceId:"",
        deviceName:"",
        deviceSerial:"",
        poblem:"",
        userId:""
      })
      Swal.fire("บันทึกข้อมูล","","success");
    } catch (error) {
      console.error(error);
      Swal.fire("เกิดข้อผิดพลาด", "โปรดลองใหม่อีกครั้ง", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (id: number) => {
    try {
        const {isConfirmed} = await config.confirmDialog();
        if(!isConfirmed)return;
        
        await axios.delete(`${config.apiURL}/api/repair-record/remove/${id}`);
        Swal.fire("ลบข้อมูลแล้ว","","success");
        getRepairRecords();
    } catch (error) {
     console.error(error);
     Swal.fire("เกิดข้อผิดพลาด", "โปรดลองใหม่อีกครั้ง", "error");
    }
  };

  return (
    <div className="card">
      <h1>บันทึกการซ่อม</h1>
      <div className="card-body">
        <button className="btn-primary" onClick={handleShowModal}>
          <FaPlus /> เพิ่มการซ่อม
        </button>

        <table className="table">
          <thead>
            <tr>
              <th>ลูกค้า</th>
              <th>ติดต่อ</th>
              <th>อุปกรณ์</th>
              <th>อาการ</th>
              <th>ก่อน</th>
              <th>หลัง</th>
              <th>พนักงาน</th>
              <th>รับซ่อม</th>
              <th>ซ่อมเสร็จ</th>
              <th>สถานะ</th>
              <th>ราคา</th>
              <th>แอคชัน</th>
            </tr>
          </thead>
          <tbody>
            {repairRecords.map((item: repairRecordsType) => {
              return (
                <tr className="bg-gray-600" key={item?.id}>
                  <td>{item?.customerName}</td>
                  <td>{item?.customerPhone}</td>
                  <td>{item?.device?.name}</td>
                  <td>{item?.poblem}</td>
                  <td>
                    <img
                      src={
                        config.apiURL + "/api/uploads/" + item?.imageBeforeRepair
                      }
                      className="rounded-lg w-[4rem] h-[2rem] object-conver border border-gray-200"
                      alt=""
                    />
                  </td>
                  <td>
                    {item?.imageAfterRepair ? (
                      <img
                        src={
                          config.apiURL + "/api/uploads/" + item?.imageAfterRepair
                        }
                        className="rounded-lg w-[3rem] h-[3rem] object-cover border border-gray-200"
                        alt=""
                      />
                    ) : (
                      item?.status
                    )}
                  </td>
                  <td>{item?.user?.username}</td>
                  <td>{dayjs(item?.createdAt).format("DD/MM/YY")}</td>
                  <td>
                    {item?.endJobDate
                      ? dayjs(item?.endJobDate).format("DD/MM/YY")
                      : item?.status}
                  </td>
                  <td>
                    {item?.status}
                  </td>
                  <td>{item?.amount || "-"}</td>
                  <td>
                    <div className="flex items-center">
                      <button
                        className="btn-edit"
                        onClick={() => {
                          handleEdit(item);
                        }}
                      >
                        <FaPen />
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleRemove(item?.id)}
                      >
                        <FaTrash />
                      </button>
                      <button
                         className="px-4 py-2 bg-gray-700 text-green-400 ml-3"
                        onClick={() => openModalReciece(item)}
                         >
                        <FaCheck/>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal
        title={modalTitle}
        isOpen={showModal}
        onClose={handleCloseModal}
        size="lg"
      >
        <form className="flex flex-col items-start" onSubmit={handleSave}>
          <div className="flex gap-4 w-full">
            <div className="w-1/2">
              <div className="">ชื่อลูกค้า</div>
              <input
                required
                type="text"
                className="form-control"
                placeholder="ชื่อลูกค้า"
                value={repairData.customerName}
                name="customerName"
                onChange={(e: any) =>
                  setRepairData({
                    ...repairData,
                    [e.target.name]: e.target.value,
                  })
                }
              />
            </div>
            <div className="w-1/2">
              <div className="">เบอร์โทรศัพท์ลูกค้า</div>
              <input
                type="tel"
                required
                className="form-control"
                placeholder="เบอร์โทรศัพท์ลูกค้า"
                value={repairData.customerPhone}
                name="customerPhone"
                onChange={(e: any) =>
                  setRepairData({
                    ...repairData,
                    [e.target.name]: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="mt-4">อุปกรณ์ที่นำมาซ่อม(ในระบบ ถ้ามี)</div>
          <select
            value={repairData.deviceId}
            name="deviceId"
            className="form-control w-full"
            onChange={(e: any) =>
              setRepairData({ ...repairData, [e.target.name]: e.target.value })
            }
          >
            <option value="0">ไม่พบอุปกรณ์ในระบบ</option>
            {devices.map((d: any) => {
              return (
                <option key={d?.id} value={d?.id}>
                  {d?.name}
                </option>
              );
            })}
          </select>

          <div className="mt-4">
            อุปกรณ์ที่นำมาซ่อม(ไม่พบอุปกรณ์ในระบบ ระบบจะบันทึกอัตโนมัติ)
          </div>
          <input
            required={parseInt(repairData.deviceId) == 0}
            readOnly={parseInt(repairData.deviceId) > 0}
            type="text"
            className="form-control"
            value={
              parseInt(repairData.deviceId) > 0 ? "" : repairData.deviceName
            }
            name="deviceName"
            onChange={(e: any) =>
              setRepairData({ ...repairData, [e.target.name]: e.target.value })
            }
            placeholder="ชื่ออุปกรณ์ (กรณีไม่พบอุปกรณ์ในระบบ)"
          />

          <div className="flex w-full gap-4 mt-4">
            <div className="w-1/2">
              <div className="">Barcode</div>
              <input
                required={parseInt(repairData.deviceId) == 0}
                readOnly={parseInt(repairData.deviceId) > 0}
                type="string"
                className="form-control"
                value={
                  parseInt(repairData.deviceId) > 0
                    ? ""
                    : repairData.deviceBarcode
                }
                name="deviceBarcode"
                onChange={(e: any) =>
                  setRepairData({
                    ...repairData,
                    [e.target.name]: e.target.value,
                  })
                }
                placeholder="บาร์โค้ด (กรณีไม่พบอุปกรณ์ในระบบ)"
              />
            </div>
            <div className="w-1/2">
              <div className="">Serial</div>
              <input
                required={parseInt(repairData.deviceId) == 0}
                readOnly={parseInt(repairData.deviceId) > 0}
                type="string"
                className="form-control"
                value={
                  parseInt(repairData.deviceId) > 0
                    ? ""
                    : repairData.deviceSerial
                }
                name="deviceSerial"
                onChange={(e: any) =>
                  setRepairData({
                    ...repairData,
                    [e.target.name]: e.target.value,
                  })
                }
                placeholder="ซีเรียล (กรณีไม่พบอุปกรณ์ในระบบ)"
              />
            </div>
          </div>

          <div className="flex gap-4 mt-4">
            <div className="w-1/2">
              <div className="">อาการเสีย</div>
              <input
                required
                type="string"
                className="form-control"
                placeholder="ระบุอาการ"
                value={repairData.poblem}
                name="poblem"
                onChange={(e: any) =>
                  setRepairData({
                    ...repairData,
                    [e.target.name]: e.target.value,
                  })
                }
              />
            </div>
            <div className="w-1/2">
              <div className="">รูปภาพก่อนซ่อม</div>
              <input
                required={editId == 0}
                type="file"
                className="form-control cursor-pointer"
                onChange={(e: any) => {
                  setImageBeforeRepair(e.target.files[0]);
                  setPreviewImg(URL.createObjectURL(e.target.files[0]));
                }}
              />
              {previewImg !== "" && (
                <img
                  src={previewImg}
                  className="w-full h-[12rem] border mt-2 object-cover"
                  alt=""
                />
              )}
            </div>
          </div>

          <button disabled={isLoading} className="btn-primary mt-4">
            <FaCheck /> {isLoading ? "ดำเนินการ..." : "บันทึกการซ่อม"}
          </button>
        </form>
      </Modal>

      <Modal 
        isOpen={showModalReceive}
        onClose={() => {
          setModalReceive(false);
          setReceiveData({
            customerName:"",
            amount:0,
            recordId:""
          })
        }}
        title="ลูกค้ามารับเครื่อง" 
      >
        <div className="">ชื่อลูกค้า</div>
        <input type="text" className="form-control" readOnly value={receiveData.customerName} />

        <div className="mt-4">ราคา</div>
        <input
            name="amount"
           type="number" 
           className="form-control" 
           value={receiveData.amount}
           onChange={(e:any) => setReceiveData({...receiveData,[e.target.name]:e.target.value})}
        />

        <button onClick={handleRecive} className="btn-primary">
          <FaCheck/> {isLoading ? 'ดำเนินการ...' : "ตกลง"}
        </button>
      </Modal>
    </div>
  );
};
export default RepairRecord;
