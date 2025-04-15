"use client";

import config from "@/app/config";
import axios from "axios";
import { useEffect, useState } from "react";
import Chart from "apexcharts";
import dayjs from "dayjs";
import { FaSearch } from "react-icons/fa";
import Swal from "sweetalert2";

const Dashboard = () => {
  const [repairRecords, setRepairRecord] = useState<any[]>([]);
  const [employies, setEmpoyies] = useState<any[]>([]);

  const [listYears,setListYears] = useState<number[]>([
    2025,2024,2023,2022,2021,2020
  ]);
  const [listMounts,setListMounts] = useState<string[]>(["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม"
    ,"สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"
  ]);
  const [selectedYear,setSelectYear] = useState<number>(dayjs().year());
  const [selectedMount,setSelectMount] = useState<number>(dayjs().month());
  const [selectedYearIncom,setSelectedYearIncome] = useState<number>(dayjs().year());

  useEffect(() => {
    getRepairRecords();
    getUsers();
  }, []);

  useEffect(() => {
    if (repairRecords.length > 0) {
      searchDayIncom();
      searchMountIncome();
    }
  }, [repairRecords]);

  const getRepairRecords = async () => {
    try {
      const res = await axios.get(`${config.apiURL}/api/repair-record/list`);
      setRepairRecord(res?.data?.repairRecords);
      renderJobPie(res?.data?.repairRecords);
    } catch (error) {
      console.error(error);
    }
  };

  const getUsers = async () => {
    try {
      const res = await axios.get(`${config.apiURL}/api/user/list`);
      setEmpoyies(res?.data?.users);
    } catch (error) {
      console.error(error);
    }
  };

  const renderChartDay = (data:number[]) => {
    const option = {
      chart:{type:"bar",height:350,background:"white"},
      series:[{name:"รายได้",data}]
    }

    const element = document.getElementById("income-day");
    const chart = new Chart(element,option);
    chart.render();
  }

  const renderChartMount = (data:number[]) => {
    const option = {
      chart:{type:"bar",height:250,background:"white"},
      series:[{name:"รายได้",data}],
      xaxis:{
        categories:["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม"
          ,"สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"
        ]
      }
    }
    const element = document.getElementById("income-mount");
    const chart = new Chart(element,option);
    chart.render();
  }

  const renderJobPie = async (records:any) => {
    const data = [
      records.length,
      records.filter((r:any) => r.status === "กำลังซ่อม").length,
      records.filter((r:any) => r.status === "ซ่อมเสร็จ").length,
    ];
    const option = {
      chart: {
        type: 'pie',
        height: 600,
        background: "white"
      },
      labels: ['งานทั้งหมด', 'งานกำลังซ่อม', 'งานซ่อมแล้ว'],
      series: data,
    };
  
    const el = document.getElementById("job-pie");
    if (el) {
      el.innerHTML = ""; // เคลียร์ element ก่อน render ใหม่
      const chart = new Chart(el, option);
      chart.render();
    }
  };

  const searchDayIncom = async () => {
    try {
      const res = await axios.get(`${config.apiURL}/api/repair-record/${selectedYear}/${Number(selectedMount) + 1}`);
      const data = res?.data;
      renderChartDay(data.map((i:any) => i.amout));
    } catch (error) {
      console.error(error);
      Swal.fire("เกิดข้อผิดพลาด","โปรดลองใหม่อีกครั้ง","error");
    }
  }

  const searchMountIncome = async () => {
    try {
      const res = await axios.get(`${config.apiURL}/api/repair-record/${selectedYearIncom}`);
      const data = res?.data;
      renderChartMount(data.map((r:any) => r.amount));
    } catch (error) {
      console.error(error);
      Swal.fire("เกิดข้อผิดพลาด","โปรดลองใหม่อีกครั้ง","error");
    }
  }

  return (
    <>
      <div className="text-2xl font-bold">Dashboard</div>
      <div className="flex mt-5 gap-4">
        <div className="w-1/4 bg-indigo-500 p-4 rounded-lg text-right">
          <div className="text-xl ">งานซ่อมทั้งหมด (งาน)</div>
          <div className="text-4xl font-bold">{repairRecords.length}</div>
        </div>
        <div className="w-1/4 bg-orange-500 p-4 rounded-lg text-right">
          <div className="text-xl ">งานกำลังซ่อม (งาน)</div>
          <div className="text-4xl font-bold">
            {repairRecords.filter((r) => r.status === "กำลังซ่อม").length}
          </div>
        </div>
        <div className="w-1/4 bg-pink-600 p-4 rounded-lg text-right">
          <div className="text-xl ">พนักงาน (คน)</div>
          <div className="text-4xl font-bold">{employies.length}</div>
        </div>
        <div className="w-1/4 bg-green-600 p-4 rounded-lg text-right">
          <div className="text-xl ">รายได้เดือนนี้ (บาท)</div>
          <div className="text-4xl font-bold">
            ฿
            {parseInt(
              repairRecords
                .map((r) => r.amount)
                .reduce((r, total) => (r += total), 0)
            ).toLocaleString()}
          </div>
        </div>
      </div>
      <div className=" mt-5 text-xl p-3 bg-gray-700 text-gray-100">รายได้รายวัน</div>
      <div className="flex w-[350px] items-end mt-2">
        <div className="w-1/2">
            <div className="">ปี</div>
            <select value={selectedYear} onChange={(e:any) => setSelectYear(e.target.value)} name="" className="mt-1 border p-2 bg-gray-700 text-gray-100 rounded-lg" id="">
              {
                listYears.map((y,index) => {
                  return <option value={y} key={index}>{y}</option>
                })
              }
            </select>
        </div>
        <div className="w-1/2">
        <div className="">เดือน</div>
            <select value={selectedMount} onChange={(e:any) => setSelectMount(e.target.value)} name="" className="mt-1 border p-2 bg-gray-700 text-gray-100 rounded-lg" id="">
              {
                listMounts.map((m,index) => {
                  return <option value={index} key={index}>{m}</option>
                })
              }
            </select>
        </div>
        <button onClick={searchDayIncom} className="btn-primary ml-4">
          <FaSearch/> ค้นหา
        </button>
      </div>
        <div className="mt-3" id="income-day"></div>
            
            <div className="w-full flex gap-6 items-center">
              <div className="w-[900px] flex flex-col">
                <div className="mt-5 text-xl p-3 bg-gray-700 text-gray-100">รายได้รายเดือน</div>
                <div className="mt-2 w-[200px] flex gap-4 items-end">
                  <div className="w-1/2">
                    <div className="">ปี</div>
                    <select value={selectedYearIncom} onChange={(e:any) => setSelectedYearIncome(e.target.value)} name="" className="mt-1 border p-2 bg-gray-700 text-gray-100 rounded-lg" id="">
                      {
                        listYears.map((y,index) => {
                          return <option value={y} key={index}>{y}</option>
                        })
                      }
                    </select>
                  </div>
                  <button onClick={searchMountIncome} className="btn-primary">
                    <FaSearch/> ค้นหา
                  </button>
                </div>
                <div className="mt-2" id="income-mount"></div>
              </div>
              <div className="">
                <div className="mt-5 text-xl bg-gray-700 text-gray-100 p-3">งานทั้งหมด</div>
                <div className="mt-2" id="job-pie"></div>
              </div>
            </div>
    </>
  );
};
export default Dashboard;
