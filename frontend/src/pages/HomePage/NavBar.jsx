import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../contexts/AuthContext";

const NavBar = ({ setActive }) => {
  const { user, logout } = useAuth();
  
  const handleLogout = () => {
    logout();
  };
  
  return (
    <nav className="bg-blue-500 py-5 ">
      <div className="container flex justify-between">
        <ul className=" flex  font-semibold text-white">
         {user?.role === "admin" &&  <Button
            onClick={() =>
              setActive({
                menu: false,
                user: true,
                choice: false,
              })
            }
            variant="link"
            className="text-white"
          >
            User
          </Button>}
          <Button onClick={() =>
              setActive({
                menu: true,
                user: false,
                choice: false,
              })
            } variant="link" className="text-white">
            Lunch Menu
          </Button>
          {user?.role === "admin" && <Button onClick={() =>
              setActive({
                menu: false,
                user: false,
                choice: true,
              })
            }  variant="link" className="text-white">
            Lunch Choice
          </Button>}
        </ul>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex gap-2 items-center text-slate-100 font-semibold">
            <img
              className="size-9 rounded-full bg-slate-200"
              src="https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png"
            />
            {user && <p>{user.username}</p>}
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleLogout()}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default NavBar;
