"use client"

import config from "@/app/config";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react"
import { FaSearch } from "react-icons/fa";

const IncomeReport = () => {

    const [startDate,setStartDate] = useState<string>(dayjs().format('YYYY-MM-DD'));
    const [endDate,setEndDate] = useState<string>(dayjs().format('YYYY-MM-DD'));
    const [listInCome,setIncome] = useState<[]>([]);

    useEffect(() => {
        fetchIncome();
    },[]);

    const fetchIncome = async () => {
        try{
            const res = await axios.get(`${config.apiURL}/api/repair-record/report/${startDate}/${endDate}`);
            setIncome(res?.data);
        }catch(err){
            console.error(err);
        }
    }

  return (
    <div className="card">
        <h1>รายงานรายได้</h1>
        <div className="card-body">
            <div className="flex items-end gap-4">
                <div className="flex flex-col">
                    <label htmlFor="">จากวันที่</label>
                    <input 
                        type="date" 
                        className="bg-gray-700 px-4 py-2 rounded-lg border border-gray-200" 
                        value={startDate}
                        onChange={(e:any) => setStartDate(e.target.value)}
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="">ถึงวันที่</label>
                    <input 
                        type="date" 
                        className="bg-gray-700 px-4 py-2 rounded-lg border border-gray-200" 
                        value={endDate}
                        onChange={(e:any) => setEndDate(e.target.value)}
                    />
                </div>
                <button onClick={fetchIncome} className="btn-primary">
                    <FaSearch/> ค้นหา
                </button>
            </div>

            <table className="table">
                <thead>
                    <tr>
                        <th>ลูกค้า</th>
                        <th>เบอร์โทรศัพท์</th>
                        <th>อุปกรณ์</th>
                        <th>แจ้งซ่อม</th>
                        <th>ชำระเงิน</th>
                        <th>จำนวนเงิน</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        listInCome.map((item:any) => {
                            return <tr key={item?.id}>
                                        <td>{item?.customerName}</td>
                                        <td>{item?.customerPhone}</td>
                                        <td>{item?.device?.name}</td>
                                        <td>{dayjs(item?.createdAt).format("DD/MM/YY")}</td>
                                        <td>{dayjs(item?.payDate).format("DD/MM/YY")}</td>
                                        <td>{parseInt(item?.amount).toLocaleString()}</td>
                                    </tr>
                        })
                    }
                </tbody>
            </table>
        </div>
    </div>
  )
}
export default IncomeReport