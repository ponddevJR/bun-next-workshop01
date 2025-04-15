"use client";

import Link from "next/link";
import { useEffect, useState } from "react"
import { FaUser } from "react-icons/fa6";

const TopNav = () => {

    const [name,setName] = useState<string>("");
    const [role,setRole] = useState<string>("");

    useEffect(() => {
        setName(localStorage.getItem('bun_service_name') || '');
        setRole(localStorage.getItem("bun_service_role") || '');

    },[]);

  return (
    <nav className="bg-gray-800 shadow-sm">
        <div className="mx-auto px-6">
            <div className="flex h-16 justify-between items-center">
                <div className="flex-shrink-0">
                    <h1 className="text-xl font-bold text-gray-100">
                        Bun Service 2025
                    </h1>
                </div>
                <div className="flex items-center">
                    <span className="text-gray-200">
                        Admin
                    </span>
                    <span className="text-indigo-400 ml-5 font-bold">
                        ( {role} )
                    </span>

                    <Link href={"/profile"} className="bg-indigo-500 text-white px-4 py-2 rounded-md ml-5 hover:bg-indigo-600 cursor-pointer flex items-center gap-2">
                        <FaUser/> profile
                    </Link>
                </div>
            </div>
        </div>
    </nav>
  )
}
export default TopNav