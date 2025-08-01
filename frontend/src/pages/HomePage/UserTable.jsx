import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router";
const UserTable = () => {
  const navigate = useNavigate();
const [userData, setUserData] = useState([]);
const user = JSON.parse(sessionStorage.getItem("user"));
if (user.role !== "admin") {
  return navigate("/");
}
  useEffect(() => {
    try {
      fetch("http://localhost:5000/user")
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") {
            return setUserData(data.result);
          } else {
            return console.log(data.error);
          }
        });
    } catch (error) {
      console.error("Error checking user:", error);
    }
  }, []);

    return (
        <div className="container">
          <h1 className="text-3xl pt-16 pb-6  text-slate-700 font-bold">User List</h1>
        <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow className="bg-blue-500 hover:bg-blue-500">
              <TableHead className="pl-5 font-medium text-slate-100">ID</TableHead>
              <TableHead className="text-slate-100">Username</TableHead>
              <TableHead className="text-slate-100" >Email</TableHead>
              <TableHead className="text-slate-100" >Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userData.map((item) => (
              <TableRow  key={item.id}>
                <TableCell className="pl-5 font-medium">{item.id}</TableCell>
                <TableCell >{item.username}</TableCell>
                <TableCell >{item.email}</TableCell>
                {item.role === "admin" ? <TableCell className="font-medium text-green-600">{item.role}</TableCell> : <TableCell >{item.role}</TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
      </div>
    );
};

export default UserTable;