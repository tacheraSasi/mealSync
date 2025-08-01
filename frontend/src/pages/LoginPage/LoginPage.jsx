import React, { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginFrom from "./LoginFrom";
import SignupForm from "./SignupForm";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user) {
      return navigate("/home");
    }
  }, [navigate]);

  return (
    <div className="flex flex-col gap-y-10 h-screen py-3 justify-center items-center">
      <h1 className="text-3xl font-bold text-neutral-800 text-center">
        Office Lunch Menu Management System
      </h1>
      <div>
        <Tabs defaultValue="login" className="w-[400px] h-[430px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Signup</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginFrom />
          </TabsContent>
          <TabsContent value="signup">
            <SignupForm />
          </TabsContent>
          <div className="bg-slate-200 py-4 text-center text-neutral-700 font-medium rounded-md mt-3">
            <p>Admin: admin@gmail.com</p>
            <p>password: admin</p>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default LoginPage;
