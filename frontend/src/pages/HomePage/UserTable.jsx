import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { API_URL } from "@/lib/constants";
import { 
  Users, 
  Shield, 
  User, 
  Mail, 
  Hash,
  Crown,
  Sparkles,
  TrendingUp
} from "lucide-react";

const UserTable = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(API_URL + "/user");
        const data = await response.json();
        
        if (data.status === "success") {
          setUserData(data.result);
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (user?.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  if (user?.role !== "admin") {
    return null;
  }

  const adminCount = userData.filter(u => u.role === 'admin').length;
  const userCount = userData.filter(u => u.role === 'user').length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
        <div className="container py-8">
          <Card className="overflow-hidden bg-white/70 backdrop-blur-sm border border-emerald-200 shadow-xl">
            <CardHeader>
              <CardTitle>Loading Users...</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      <div className="container py-8 space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/70 backdrop-blur-sm rounded-full border border-emerald-200 shadow-lg">
            <Users className="h-6 w-6 text-emerald-600" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              User Management
            </h1>
            <Sparkles className="h-5 w-5 text-yellow-500" />
          </div>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Manage and oversee all registered users in the MealSync system
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-600 text-sm font-medium">Total Users</p>
                  <p className="text-3xl font-bold text-emerald-800">{userData.length}</p>
                </div>
                <div className="w-12 h-12 bg-emerald-200 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-emerald-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Regular Users</p>
                  <p className="text-3xl font-bold text-blue-800">{userCount}</p>
                </div>
                <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Administrators</p>
                  <p className="text-3xl font-bold text-purple-800">{adminCount}</p>
                </div>
                <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
                  <Crown className="h-6 w-6 text-purple-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="bg-white/70 backdrop-blur-sm border border-emerald-200 shadow-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-blue-50 border-b border-emerald-100 p-6">
            <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              <Users className="h-6 w-6 text-emerald-600" />
              Registered Users
              <Badge variant="secondary" className="ml-auto bg-emerald-100 text-emerald-800">
                <TrendingUp className="h-3 w-3 mr-1" />
                {userData.length} Total
              </Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50 hover:bg-slate-50/70">
                    <TableHead className="pl-6 py-4 font-bold text-slate-700">
                      <div className="flex items-center gap-2">
                        <Hash className="h-4 w-4" />
                        ID
                      </div>
                    </TableHead>
                    <TableHead className="py-4 font-bold text-slate-700">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        User Profile
                      </div>
                    </TableHead>
                    <TableHead className="py-4 font-bold text-slate-700">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email Address
                      </div>
                    </TableHead>
                    <TableHead className="py-4 font-bold text-slate-700">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Role
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userData.map((item, index) => (
                    <TableRow 
                      key={item.id} 
                      className="hover:bg-slate-50/50 transition-colors duration-200 group"
                      style={{ 
                        animation: `fade-in-up 0.5s ease-out ${index * 0.1}s both`
                      }}
                    >
                      <TableCell className="pl-6 py-4 font-medium text-slate-800">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-slate-600">
                              {item.id}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-gradient-to-br from-emerald-100 to-blue-100 text-emerald-700 font-semibold">
                              {item.username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-slate-800">{item.username}</p>
                            <p className="text-sm text-slate-500">@{item.username.toLowerCase()}</p>
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-slate-400" />
                          <span className="text-slate-700">{item.email}</span>
                        </div>
                      </TableCell>
                      
                      <TableCell className="py-4">
                        {item.role === "admin" ? (
                          <Badge className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white">
                            <Crown className="h-3 w-3 mr-1" />
                            Administrator
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200">
                            <User className="h-3 w-3 mr-1" />
                            User
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserTable;
