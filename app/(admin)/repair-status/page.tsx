"use client";

import Modal from "@/app/components/modal";
import config from "@/app/config";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { FaCheck, FaFilter, FaPen } from "react-icons/fa6";
import Swal from "sweetalert2";

type repairRecordsType = {
  id: number;
  customerName: string;
  customerPhone: string;
  device: { id: number; name: string };
  user: { id: number; username: string,section:{name:string} };
  poblem: string;
  imageBeforeRepair: string;
  imageAfterRepair: string;
  createdAt: Date;
  endJobDate: Date;
  status: string;
  solving: string;
};

const RepairStatus = () => {
  const [original, setOriginal] = useState<repairRecordsType[]>([]);
  const [repairRecords, setRepairRecords] = useState<repairRecordsType[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editId, setEditId] = useState<number>(0);
  const [newStatus, setNewStatus] = useState<string>("");
  const [solving, setSolving] = useState<string>("");
  const [cancelReason, setCancelReason] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [engineers,setEngineers] = useState<{id:number,username:string,section:{name:string}}[]>([]);
  const [engineerId,setEngineerId] = useState<number>(0);

  useEffect(() => {
    getRepairRecords();
    getEngineers();
  }, []);

  const getRepairRecords = async () => {
    try {
      const res = await axios.get(`${config.apiURL}/api/repair-record/list`);
      setRepairRecords(res?.data?.repairRecords);
      setOriginal(res?.data?.repairRecords);
    } catch (error) {
      console.error(error);
    }
  };

  const getEngineers = async () => {
    try {
      const res = await axios.get(`${config.apiURL}/api/user/engineer`);
      setEngineers(res?.data?.engineers);
    } catch (error) {
      console.error(error);
    }
  }

  const handleEdit = async (item: any) => {
    setEditId(item?.id);
    setShowModal(true);
    setNewStatus(item?.status);
    setSolving(item?.solving);
  };

  const updateStatus = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.put(
        `${config.apiURL}/api/repair-record/status/${editId}`,
        { newStatus, solving,engineerId }
      );
      if (res?.data?.err)
        return Swal.fire("เกิดข้อผิดพลาด", res?.data?.err, "error");

      Swal.fire("บันทึกข้อมูลแล้ว", "", "success");
      setShowModal(false);
      setNewStatus("");
      getRepairRecords();
    } catch (error) {
      console.error(error);
      Swal.fire("เกิดข้อผิดพลาด", "โปรดลองใหม่อีกครั้ง", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const filterData = (status: string) => {
    console.log("🚀 ~ filterData ~ status:", status)
    if (status === "") {
      setRepairRecords(original);
    } else {
      setRepairRecords(original.filter((r) => r.status === status));
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h1>สถานะการซ่อม</h1>
        <div className="flex items-center gap-2">
          <label htmlFor="">เลือกสถานะ</label>
          <select
            onChange={(e: any) => filterData(e.target.value)}
            className="bg-white text-black p-2 rounded-lg"
            name=""
            id=""
          >
            <option value="">ทั้งหมด</option>
            <option value="รอซ่อม">รอซ่อม</option>
            <option value="กำลังซ่อม">กำลังซ่อม</option>
            <option value="ซ่อมเสร็จ">ซ่อมเสร็จ</option>
            <option value="ยกเลิก">ยกเลิก</option>
            <option value="รับแล้ว">รับแล้ว</option>
          </select>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>ลูกค้า</th>
              <th>ติดต่อ</th>
              <th>อุปกรณ์</th>
              <th>อาการ</th>
              <th>ก่อน</th>
              <th>หลัง</th>
              <th>รับซ่อม</th>
              <th>ซ่อมเสร็จ</th>
              <th>สถานะ</th>
              <th>ช่าง</th>
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
                        config.apiURL +
                        "/api/uploads/" +
                        item?.imageBeforeRepair
                      }
                      className="rounded-lg w-[4rem] h-[3rem] object-conver border border-gray-200"
                      alt=""
                    />
                  </td>
                  <td>
                    {item?.imageAfterRepair ? (
                      <img
                        src={
                          config.apiURL +
                          "/api/uploads/" +
                          item?.imageAfterRepair
                        }
                        className="rounded-lg w-[3rem] h-[3rem] object-cover border border-gray-200"
                        alt=""
                      />
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>{dayjs(item?.createdAt).format("DD/MM/YY")}</td>
                  <td>
                    {item?.endJobDate
                      ? dayjs(item?.endJobDate).format("DD/MM/YY")
                      : "-"}
                  </td>
                  <td>{item?.status}</td>
                  <td>{item?.user?.section?.name === "engineer" ? item?.user?.username : "-"}</td>
                  <td>
                    <div className="flex items-center ">
                      <button
                        className="btn-edit"
                        onClick={() => {
                          handleEdit(item);
                        }}
                      >
                        <FaPen /> ปรับสถานะ
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
        isOpen={showModal}
        title="อัพเดตสถานะการซ่อม"
        onClose={() => setShowModal(false)}
      >
        <form onSubmit={updateStatus}>
          <div className="">เลือกสถานะ</div>
          <select
            name=""
            id=""
            className="w-full form-control"
            value={newStatus}
            onChange={(e: any) => {
              setNewStatus(e.target.value);
              setSolving("");
            }}
          >
            {["รอซ่อม", "กำลังซ่อม", "ยกเลิก", "ซ่อมเสร็จ"].map(
              (item: string) => (
                <option value={item} key={item}>
                  {item}
                </option>
              )
            )}
          </select>

          <div className="mt-4">ช่าง</div>
          <select 
            value={engineerId}
            onChange={(e:any) => setEngineerId(e.target.value)}
            name="" 
            id=""
            className="form-control w-full"
          >
            {
              engineers.map((e:any) => 
                <option value={e.id} key={e.id}>{e.username}</option>
              )
            }
          </select>

          {newStatus === "ซ่อมเสร็จ" ? (
            <>
              <div className="mt-4">วิธีซ่อม</div>
              <input
                required
                className="form-control"
                type="text"
                placeholder="ระบุวิธีซ่อม/ซ่อมอย่างไร"
                value={solving}
                onChange={(e: any) => setSolving(e.target.value)}
              />
            </>
          ) : newStatus === "ยกเลิก" ? (
            <>
              <>
                <div className="mt-4">เหตุผล</div>
                <input
                  required
                  className="form-control"
                  type="text"
                  placeholder="ระบุเหตุผลที่ยกเลิก"
                  value={cancelReason}
                  onChange={(e: any) => setCancelReason(e.target.value)}
                />
              </>
            </>
          ) : (
            <></>
          )}

          <button disabled={isLoading} className="btn-primary mt-4">
            <FaCheck />
            {isLoading ? "ดำเนินการ..." : "บันทึก"}
          </button>
        </form>
      </Modal>
    </div>
  );
};
export default RepairStatus;
