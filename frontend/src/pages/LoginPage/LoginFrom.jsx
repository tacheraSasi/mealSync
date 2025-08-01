import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
const LoginFrom = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    try {
      const response = await fetch("http://localhost:5000/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.status === "success") {
        setError("");
        sessionStorage.setItem("user", JSON.stringify(result.result));
        navigate("/home");
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error("Error checking user:", error);
    }
  };

  return (
    <Card>
      <form action="" onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Enter your email and password to login
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {error === "" ? (
            ""
          ) : (
            <p className="bg-red-100 text-gray-700 text-center py-3 text-sm rounded-sm">
              {error}
            </p>
          )}
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              {...register("email", {
                required: "Email Address is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                },
              })}
              aria-invalid={errors.email ? "true" : "false"}
              id="name"
              placeholder="enter your email"
            />
            {errors.email && (
              <p role="alert" className="text-red-500 text-sm">
                {errors.email.message}
              </p>
            )}
            {errors.email && errors.email.type === "pattern" && (
              <p role="alert" className="text-red-500 text-sm">
                Invalid email format
              </p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="enter your password"
              {...register("password", { required: "password is required" })}
              aria-invalid={errors.password ? "true" : "false"}
            />
            {errors.password && (
              <p role="alert" className="text-red-500 text-sm">
                {errors.password.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit">Login</Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default LoginFrom;
