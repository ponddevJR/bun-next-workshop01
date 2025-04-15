"use client";

import axios from "axios";
import config from "@/app/config";
import { useEffect, useState } from "react";
import { FaPen, FaPlus, FaTrash } from "react-icons/fa6";
import Modal from "@/app/components/modal";
import dayjs from "dayjs";
import { FaSave } from "react-icons/fa";
import Swal from "sweetalert2";

const EmployeePage = () => {
  const [title,setTitle] = useState<string>("เพิ่มข้อมูลพนักงานร้าน");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [users, setUsers] = useState<object[]>([]);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<string>("user");
  const [id, setId] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [confirmPass, setConfrimPass] = useState<string>("");
  const [deparments,setDepartments] = useState<object[]>([]);
  const [sections,setSections] = useState<object[]>([]);
  const [sectionId,setSectionId] = useState<number>(0);
  const [departmentId,setDepartmentId] = useState<number>(0);

  const handleCloseModal = () => {
    setShowModal(false);
    setId(0);
    setUsername("");
    setRole("user");
    setPassword("");
    setConfrimPass("");
    setTitle("เพิ่มข้อมูลพนักงานร้าน");
    // setDepartmentId(0);
    // setSectionId(0);
  };

  useEffect(() => {
    getUsers();
    getDepartments();
  }, []);

  const handleShowModal = () => {
    setShowModal(true);
  }

  const getUsers = async () => {
    try {
      const res = await axios.get(`${config.apiURL}/api/user/list`);
      setUsers(res?.data?.users);
    } catch (error) {
      console.error(error);
    }
  };

  const getDepartments = async () => {
    try {
      const res = await axios.get(`${config.apiURL}/api/department/list`);
      setDepartments(res?.data?.departments);
      setDepartmentId(res?.data?.departments[0]?.id)
      getSections(res?.data?.departments[0]?.id);
    } catch (error) {
      console.error(error);
    }
  }

  const getSections = async (departmentId:number) => {
    try {
      const res = await axios.get(`${config.apiURL}/api/section/list/${departmentId}`);
      setSections(res?.data?.sections);
      setSectionId(res?.data?.sections[0]?.id)
    } catch (error) {
      console.error(error);
    }
  }

  const handleChageDepartment = (departmentId:number) => {
    setDepartmentId(departmentId);
    getSections(departmentId);
  }

  const handleEdit = async (item: any) => {
    setId(item?.id);
    setUsername(item?.username);
    setRole(item?.role);
    setTitle("แก้ไขข้อมูลพนักงานร้าน");
    setDepartmentId(item?.section?.department?.id);
    const res = await axios.get(`${config.apiURL}/api/section/list/${item?.section?.department?.id}`);
    setSections(res?.data?.sections);
    setSectionId(item?.section?.id)

    setShowModal(true);
  };

  const handleRemove = async (id: string) => {
    try {
      const {isConfirmed} = await config.confirmDialog();
      if(!isConfirmed)return;

      await axios.delete(`${config.apiURL}/api/user/remove/${id}`);
      getUsers();
    } catch (error) {
      console.error(error);
      Swal.fire("เกิดข้อผิดพลาด", "โปรดลองอีกครั้ง", "error");
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (password !== confirmPass)
        return Swal.fire("รหัสผ่านไม่ตรงกัน", "", "error");
      const payload = {
        username,
        password,
        role,
        sectionId:Number(sectionId)
      };

      let res;
      if (id === 0) {
        res = await axios.post(`${config.apiURL}/api/user/create`, payload);
      } else {
        res = await axios.put(`${config.apiURL}/api/user/update/${id}`, payload,{headers:{"Authorization":`Bearer ${localStorage.getItem(config.tokenKey)}`}});
      }
      if(res?.data?.err)return Swal.fire("เกิดข้อผิดพลาด",res?.data?.err,"error");

      setShowModal(false);
      setId(0);
      setUsername("");
      setPassword("");
      setRole("");
      setConfrimPass("");

      getUsers();
    } catch (error) {
      console.error(error);
      Swal.fire("เกิดข้อผิดพลาด", "โปรดลองอีกครั้ง", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <h1>พนักงานร้าน</h1>
      <div className="card-body">
        <button onClick={handleShowModal} className="btn-primary">
          <FaPlus /> เพิ่มข้อมูล
        </button>

        <table className="table">
          <thead>
            <tr>
              <th>username</th>
              <th>role</th>
              <th>แผนก</th>
              <th>ผ่าย</th>
              <th>วันที่</th>
              <th>แอคชัน</th>
            </tr>
          </thead>
          <tbody>
            {users.map((item: any) => {
              return (
                <tr className="bg-gray-600" key={item?.id}>
                  <td>{item?.username}</td>
                  <td>{item?.role}</td>
                  <td>{item?.section?.department?.name || 'ไม่พบข้อมูล'}</td>
                  <td>{item?.section?.name}</td>
                  <td>{dayjs(item?.createdAt).format("DD/MM/YY")}</td>
                  <td style={{ width: "100px" }}>
                    <div className="flex items-center ">
                      <button
                        className="btn-edit"
                        onClick={() => {
                          handleEdit(item);
                        }}
                      >
                        <FaPen /> แก้ไข
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleRemove(item?.id)}
                      >
                        <FaTrash /> ลบ
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
        title={title}
        onClose={handleCloseModal}
      >
        <form onSubmit={handleSave} className="flex flex-col">
          <div className="mt-3">username</div>
          <input
            required
            type="text"
            className="form-control"
            placeholder="ชื่อผู้ใช้งาน"
            value={username}
            onChange={(e: any) => setUsername(e.target.value)}
          />

          <div className="mt-3">password</div>
          <input
            type="password"
            className="form-control"
            placeholder="รหัสผ่าน"
            value={password}
            onChange={(e: any) => setPassword(e.target.value)}
          />

          <div className="mt-3">confirm password</div>
          <input
            type="password"
            className="form-control"
            placeholder="ยืนยัน รหัสผ่าน"
            value={confirmPass}
            onChange={(e: any) => setConfrimPass(e.target.value)}
          />

          <div className="mt-3">role</div>
          <select
            value={role}
            onChange={(e: any) => setRole(e.target.value)}
            required
            className="form-control w-full"
          >
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>

          <div className="flex gap-3 mt-3 w-full">
            <div className="w-1/2">
              <label htmlFor="">แผนก</label>
              <select value={departmentId} onChange={(e:any) => handleChageDepartment(e.target.value)} name="" className="form-control w-full" id="">
                {
                  deparments.map((item:any) => {
                    return <option value={item?.id} key={item?.id}>{item?.name}</option>
                  })
                }
              </select>
            </div>
            <div className="w-1/2">
              <label htmlFor="">ฝ่าย</label>
              <select value={sectionId} onChange={(e:any) => setSectionId(e.target.value)} name="" className="form-control w-full" id="">
                {
                  sections.map((item:any) => {
                    return <option value={item?.id} key={item?.id}>{item?.name}</option>
                  })
                }
              </select>
            </div>
          </div>

          <button disabled={isLoading} className="btn btn-primary mt-3">
            <FaSave /> {isLoading ? "กำลังดำเนินการ..." : "บันทึกข้อมูล"}
          </button>
        </form>
      </Modal>
    </div>
  );
};
export default EmployeePage;
