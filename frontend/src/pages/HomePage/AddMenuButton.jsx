import { PlusCircledIcon } from "@radix-ui/react-icons";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { format } from "date-fns";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import MenuDateInput from "./MenuDateInput";
const AddMenuButton = () => {
  const [date, setDate] = useState();
  const dateString = date ? format(date, "d-MMM-yyyy") : "";
const user = JSON.parse(sessionStorage.getItem("user"));
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const onSubmit = async (data) => {
    const menu = {
      menuname: data.menuname,
      description: data.description,
      menudate: dateString,
      createdby: user.id,
    }
    try {
      const response = await fetch("http://localhost:5000/menu/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(menu),
      });

      const result = await response.json();

      if (result.status === "created") {
        window.location.reload();
      } else {
        console.log(result.error);;
      }
    } catch (error) {
      console.error("Error checking menu:", error);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <PlusCircledIcon className="mr-2 h-4 w-4" /> Add Menu
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Delicious Menu</DialogTitle>
        </DialogHeader>
        <form action="" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <div className="flex gap-2 w-full">
              <div className="space-y-1 w-[60%]">
                <Label htmlFor="menuname">Menu Name</Label>
                <Input
                  id="menuname"
                  placeholder="enter menuname"
                  {...register("menuname", {
                    required: "menu name is required",
                  })}
                  aria-invalid={errors.menuname ? "true" : "false"}
                />
                {errors.menuname && (
                  <p role="alert" className="text-red-500 text-sm">
                    {errors.menuname.message}
                  </p>
                )}
              </div>
              <div className="space-y-1 w-[40%]">
                <Label htmlFor="menudate">Menu Date</Label>
                <MenuDateInput date={date} setDate={setDate}/>
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                type="text"
                placeholder="enter menu description"
                {...register("description", { required: "description is required" })}
                aria-invalid={errors.description ? "true" : "false"}
              />
              {errors.description && (
                <p role="alert" className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button type="submit">ADD MENU</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMenuButton;
