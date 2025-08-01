import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import AddMenuButton from "./AddMenuButton";
import { SquareCheckBig } from "lucide-react";
import { isBefore } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { fetchMenuData } from "@/hooks/fetchMenuData";
import { fetchLunchData } from "@/hooks/fetchLunchData";
import UpdateButton from "./UpdateButton";

const MenuTable = () => {
  const [menuData, setMenuData] = useState([]);
  const [lunchData, setLunchData] = useState([]);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const handleAddMenu = async (userid, menuid) => {
    const data = {
      userid,
      menuid,
    };
    console.log(data);
    try {
      const response = await fetch(`http://localhost:5000/lunchChoice/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.status === "created") {
        console.log("created");
        await fetchMenuData(setMenuData);
        await fetchLunchData(setLunchData);
      } else {
        console.log(result.error);
      }
    } catch (error) {
      console.error("Error checking:", error);
    }
  };


  useEffect(() => {
    fetchMenuData(setMenuData);
    fetchLunchData(setLunchData);
  }, []);

  const hanldeRemove = async (id) => {
    const data = lunchData.find((lunch) => lunch.menuid === id && lunch.userid === user.id)
    try {
      const response = await fetch(`http://localhost:5000/lunchChoice/${data.id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (result.status === "success") {
        await fetchMenuData(setMenuData);
        await fetchLunchData(setLunchData);
        console.log("success");
      } else {
        console.log(result.error);
      }
    } catch (error) {
      console.error("Error checking user:", error);
    }
  };

  return (
    <div className="container">
      <div className="flex pt-16 pb-6 justify-between">
        <h1 className="text-3xl  text-slate-700 font-bold">Menu List</h1>
        {user.role === "admin" ? <AddMenuButton /> : ""}
      </div>
      <div className="border rounded-md">
        <p className="text-center text-xl font-medium py-3 text-slate-700 bg-green-400">
          TODAY'S MENU
        </p>
        <Table>
          <TableHeader>
            <TableRow className="text-center">
              <TableHead className="pl-5">No.</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Menu Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Choose</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {menuData
              .filter((item) => item.isactive)
              .map((item, index) => (
                <TableRow key={item.id} className="cursor-pointer">
                  <TableCell className="pl-5">{index + 1}</TableCell>
                  <TableCell>{item.menudate}</TableCell>
                  <TableCell className="font-medium">{item.menuname}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell className="text-green-500 ">Active</TableCell>
                  {lunchData.find((lunch) => lunch.menuid === item.id && lunch.userid === user.id) ? (
                    <TableCell className="flex justify-between text-green-500 px-5">
                      <SquareCheckBig className="size-5 " />
                      <div className="flex gap-2">
                      <Badge
                        variant="destructive"
                        className="cursor-pointer hover:bg-red-700"
                        onClick={() => hanldeRemove(item.id)}
                      >
                        remove
                      </Badge>
                      {user.role === "admin" ? <UpdateButton item={item} /> : ""}
                      </div>
                    </TableCell>
                  ) : (
                    <TableCell className="text-gray-400 flex justify-between hover:text-green-500 px-5 cursor-pointer">
                      <SquareCheckBig
                        onClick={() => handleAddMenu(user.id, item.id)}
                        className="size-5 "
                      />
                      {user.role === "admin" ? <UpdateButton item={item} /> : ""}
                    </TableCell>
                  )}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {user.role == "admin" && (
        <div className="border rounded-md mt-10">
          <p className="text-center text-xl font-medium py-3 text-slate-700 bg-indigo-300">
            PENDING MENU
          </p>
          <Table>
            <TableHeader>
              <TableRow className="text-center">
                <TableHead className="pl-5">No.</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Menu Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {menuData
                .filter((item) => {
                  const menuDate = new Date(item.menudate);
                  return !isBefore(menuDate, new Date());
                })
                .map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="pl-5">{index + 1}</TableCell>
                    <TableCell>{item.menudate}</TableCell>
                    <TableCell className="font-medium">
                      {item.menuname}
                    </TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell className="text-yellow-600">Panding</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      )}
      <div className="border rounded-md my-10">
        <p className="text-center text-xl font-medium py-3 bg-pink-200 text-slate-700 ">
          PREVIOUS MENU
        </p>
        <Table>
          <TableHeader>
            <TableRow className="text-center">
              <TableHead className="pl-5">No.</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Menu Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Choose</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {menuData
              .filter((item) => {
                const menuDate = new Date(item.menudate);
                return isBefore(menuDate, new Date()) && !item.isactive;
              })
              .map((item, index) => (
                <TableRow key={item.id} className="cursor-not-allowed opacity-50 bg-gray-100 hover:bg-gray-100">
                  <TableCell className="pl-5">{index + 1}</TableCell>
                  <TableCell>{item.menudate}</TableCell>
                  <TableCell className="font-medium">{item.menuname}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell className="text-red-600 opacity-50">Close</TableCell>
                  {lunchData.find((lunch) => lunch.menuid === item.id && lunch.userid === user.id) ? (
                    <TableCell className="flex gap-x-10 text-green-500 pl-5">
                      <SquareCheckBig className="size-5 " />
                    </TableCell>
                  ) : (
                    <TableCell className="text-gray-400 pl-5 cursor-pointer">
                      <SquareCheckBig
                        className="size-5 "
                      />
                    </TableCell>
                  )}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MenuTable;
