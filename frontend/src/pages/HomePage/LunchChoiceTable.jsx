import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SquareCheckBig } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { fetchLunchData } from "@/hooks/fetchLunchData";
import { format, isBefore } from "date-fns";
const LunchChoiceTable = () => {
  const [choice, setChoice] = useState({});
  const [lunchData, setLunchData] = useState([]);
  useEffect(() => {
    fetchLunchData(setLunchData);
  }, []);

  const user = JSON.parse(sessionStorage.getItem("user"));

  const hanldeRemove = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/lunchChoice/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (result.status === "success") {
        fetchLunchData(setLunchData);
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
        <h1 className="text-3xl  text-slate-700 font-bold">
          Lunch Choice List
        </h1>
      </div>
      <div className="border rounded-md">
        <p className="text-center text-xl font-medium py-3 text-slate-700 bg-green-400">
          TODAY'S CHOICE MENU
        </p>
        <Table>
          <TableHeader>
            <TableRow className="text-center">
              <TableHead className="pl-5">No.</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Menu Name</TableHead>
              <TableHead>User Name</TableHead>
              <TableHead>Choose</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lunchData
              .filter(
                (item) => item.menudate === format(new Date(), "dd-MMM-yyyy")
              )
              .map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="pl-5">{index + 1}</TableCell>
                  <TableCell>{item.menudate}</TableCell>
                  <TableCell className="font-medium">{item.menuname}</TableCell>
                  <TableCell>{item.username}</TableCell>
                  <TableCell className="flex gap-x-10 text-green-500 pl-5">
                    <SquareCheckBig className="size-5 " />
                    {item.userid === user.id && (
                      <Badge
                      onClick={() => hanldeRemove(item.id)}
                      variant="destructive"
                      className="cursor-pointer hover:bg-red-700"
                    >
                      remove
                    </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
      <div className="border rounded-md mt-10">
        <p className="text-center text-xl font-medium py-3 text-slate-700 bg-pink-300">
          PRIVIOUS CHOICE MENU
        </p>
        <Table>
          <TableHeader>
            <TableRow className="text-center">
              <TableHead className="pl-5">No.</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Menu Name</TableHead>
              <TableHead>User Name</TableHead>
              <TableHead>Choose</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lunchData
              .filter(
                (item) => item.menudate !== format(new Date(), "dd-MMM-yyyy")
              )
              .map((item, index) => (
                <TableRow key={item.id} className="cursor-not-allowed opacity-50 bg-gray-100 hover:bg-gray-100">
                  <TableCell className="pl-5">{index + 1}</TableCell>
                  <TableCell>{item.menudate}</TableCell>
                  <TableCell className="font-medium">{item.menuname}</TableCell>
                  <TableCell>{item.username}</TableCell>
                  <TableCell className="flex gap-x-10 text-green-500 pl-5">
                    <SquareCheckBig className="size-5 " />
                  
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default LunchChoiceTable;
