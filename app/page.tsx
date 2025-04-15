"use client";

import axios from "axios";
import config from "./config";
import { useState } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { FaArrowRight, FaDoorOpen, FaLock, FaUser } from "react-icons/fa6";

const Home = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading,setIsLoading] = useState<boolean>(false);
  const redirect = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(`${config.apiURL}/api/user/sign-in`, {
        username,
        password,
      });

      if (!res.data.token)
        return Swal.fire(
          "ไม่สามารถเข้าสู่ระบบได้",
          "รหัสผ่านหรือผู้ใช้งานไม่ถูกต้อง",
          "error"
        );
      
      await Swal.fire("เข้าสู่ระบบแล้ว","","success");
      localStorage.setItem(config.tokenKey, res.data.token);
      localStorage.setItem('bun_service_name',res?.data?.user?.name);
      localStorage.setItem('bun_service_role',res?.data?.user?.role);

      redirect.push("/dashboard");
    } catch (error) {
      console.error(error);
      Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถเข้าสู่ระบบได้", "error");
    }finally{
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="w-screen h-screen flex flex-col gap-3 items-center justify-center p-2 bg-gradient-to-tr from-gray-800 to bg-gray-500">
        <h1 className="text-2xl font-bold rounded-xl p-3 shadow bg-black text-white ">
          ระบบ Bun Service 2025
        </h1>
        <form
          onSubmit={handleSubmit}
          className="bg-slate-100 shadow-md p-5 py-8 rounded-lg flex flex-col items-center gap-6"
        >
          <h1 className="uppercase font-extrabold  text-5xl text-black">
            welcome
          </h1>
          <div className="flex flex-col gap-2 w-full items-start">
            <label htmlFor="" className="flex items-center gap-2 text-lg">
              <FaUser /> username
            </label>
            <input
              required
              type="text"
              className="form-control outline-none focus:ring focus:ring-black"
              placeholder="ชื่อผู้ใช้งาน"
              value={username}
              onChange={(e:any) => setUsername(e.target.value)}
              name="username"
            />
          </div>
          <div className="flex flex-col gap-2 w-full items-start">
            <label htmlFor="" className="flex items-center gap-2 text-lg">
              <FaLock /> password
            </label>
            <input
              required
              type="password"
              className="form-control outline-none focus:ring focus:ring-black"
              placeholder="รหัสผ่าน"
              name="password"
              value={password}
              onChange={(e:any) => setPassword(e.target.value)}
            />
          </div>

          <button disabled={isLoading} className="btn w-full cursor-pointer">
            <FaArrowRight /> {isLoading ? "checking ..." :  "Sign-in"}
          </button>
        </form>
      </div>
    </>
  );
};
export default Home;
