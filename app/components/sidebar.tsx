"use client";
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { FaBox, FaChartSimple, FaGear, FaHouse, FaMoneyBill, FaRightFromBracket, FaScrewdriver, FaShop, FaUser, FaUsers } from "react-icons/fa6"
import Swal from "sweetalert2";
import config from "../config";
import axios from "axios";

const SideBar = () => {

    const path = usePathname();
    const router = useRouter();
    const [userRole,setUserRole] = useState<string>("");

    const menItems = [
        {title:"Dashboard",icon:<FaChartSimple/>,url:"/dashboard"},
        {title:"พนักงานร้าน",icon:<FaUsers/>,url:"/employee"},
        {title:"บันทึกการซ่อม",icon:<FaScrewdriver/>,url:"/repair-record"},
        {title:"สถานะการซ่อม",icon:<FaGear/>,url:"/repair-status"},
        {title:"สถิติการซ่อมของช่าง",icon:<FaRightFromBracket/>,url:"/repair-reports"},
        {title:"รายงานรายได้",icon:<FaMoneyBill/>,url:"/income-report"},
        {title:"ทะเบียนวัสดุ อุปกรณ์",icon:<FaBox/>,url:"/devices"},
        {title:"ข้อมูลร้าน",icon:<FaShop/>,url:"/shop"}
    ]

    const getUserLevel = async () => {
        try {
            const token = localStorage.getItem(config.tokenKey);
            const res = await axios.get(`${config.apiURL}/api/user/info`,{headers:{"Authorization":`Bearer ${token}`}});
            setUserRole(res?.data?.role);

            if(res?.data?.role === "user")return router.push("/repair-record");
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        const token = localStorage.getItem(config.tokenKey);
        if(!token)return router.push("/");
        getUserLevel();
    },[]);

    const hanldleLogout = async () => {
        const {isConfirmed} = await Swal.fire({
            title:"ออกจากระบบ",
            text:"ต้องการออกจากระบบหรือไม่?",
            icon:"question",
            showCancelButton:true,
            confirmButtonText:"ออกจากระบบ",
            cancelButtonText:"ไม่ต้องการ"
        })
        if(!isConfirmed)return;

        localStorage.clear();
        router.push("/");
    }

  return (
    <aside className="sidebar">
        <div className="sidebar-header">
            <FaUser className="text-3xl mr-5"/>
            <h1 className="text-xl font-bold">
                Welcome Admin
            </h1>
        </div>
        <nav className="sidebar-nav">
            <ul>
                {
                    menItems.map((item:any,index:number) => {
                        if(userRole === "user" && (index === 0 || index === 1 || index === 4 || index === 5 || index === 7)) return;

                        return <Link className={`sidebar-item ${path === item?.url ? 'bg-gray-300 text-gray-800' : 'text-gray-300'}`} href={item?.url} key={item?.title}>
                                {item?.icon} {item?.title}
                                </Link>
                    })
                }
                <button onClick={hanldleLogout} className="flex items-center gap-2 p-2 text-gray-300 hover:bg-red-700 bg-red-600 rounded-lg transition-all w-full cursor-pointer">
                    <FaRightFromBracket/> ออกจากระบบ
                </button>
            </ul>
        </nav>
    </aside>
  )
}
export default SideBar