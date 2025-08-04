import { useEffect, useState } from "react";
import { format, isBefore } from "date-fns";
import { 
  CheckCircle2, 
  Clock, 
  Utensils,
  CalendarDays,
  Info,
  Plus,
  Sparkles,
  TrendingUp
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { fetchMenuData } from "@/hooks/fetchMenuData";
import { fetchLunchData } from "@/hooks/fetchLunchData";
import UpdateButton from "./UpdateButton";
import AddMenuButton from "./AddMenuButton";
import { Skeleton } from "@/components/ui/skeleton";
import WeeklyPlanningCard from "@/components/weekly/WeeklyPlanningCard";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const MenuTable = () => {
  const [menuData, setMenuData] = useState([]);
  const [lunchData, setLunchData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchMenuData(setMenuData),
          fetchLunchData(setLunchData)
        ]);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Handle selecting a menu item
  const handleAddMenu = async (userid, menuid) => {
    try {
      const response = await fetch(`${API_URL}/lunchChoice/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userid, menuid }),
      });
      
      const result = await response.json();
      if (result.status === "created") {
        await Promise.all([
          fetchMenuData(setMenuData),
          fetchLunchData(setLunchData)
        ]);
      } else {
        console.error("Error:", result.error);
      }
    } catch (error) {
      console.error("Error selecting menu:", error);
    }
  };



  // Filter menu items by status
  const activeMenus = menuData.filter(item => item.isactive);
  const pendingMenus = menuData.filter(item => {
    const menuDate = new Date(item.menudate);
    return !isBefore(menuDate, new Date()) && !item.isactive;
  });
  const pastMenus = menuData.filter(item => {
    const menuDate = new Date(item.menudate);
    return isBefore(menuDate, new Date()) && !item.isactive;
  });

  // Check if a menu item is selected by the current user
  const isMenuSelected = (menuId) => {
    return lunchData.some(lunch => lunch.menuid === menuId && lunch.userid === user?.id);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'MMM d, yyyy');
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full mt-4" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (menuData.length === 0) {
    return (
      <div className="container py-16 text-center">
        <div className="mx-auto max-w-md">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <Utensils className="h-8 w-8 text-emerald-600" />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-slate-900">No menus available</h2>
          <p className="mt-2 text-slate-600">
            {user?.role === 'admin' 
              ? 'Create your first menu to get started.' 
              : 'Check back later for available menus.'}
          </p>
          {user?.role === 'admin' && (
            <div className="mt-6">
              <AddMenuButton />
            </div>
          )}
        </div>
      </div>
    );
  }

  // Menu card component
  const MenuCard = ({ menu, status = "active" }) => {
    const isSelected = isMenuSelected(menu.id);
    const isPast = isBefore(new Date(menu.menudate), new Date());
    const isActive = menu.isactive;
    
    const getCardStyles = () => {
      if (status === "past") {
        return "bg-slate-50 border-slate-200 opacity-75 hover:opacity-100";
      }
      if (status === "pending") {
        return "bg-amber-50 border-amber-200 hover:border-amber-300 hover:shadow-amber-100";
      }
      if (isSelected) {
        return "bg-emerald-50 border-emerald-300 shadow-emerald-100 ring-2 ring-emerald-200";
      }
      return "bg-white border-slate-200 hover:border-emerald-300 hover:shadow-emerald-100";
    };
    
    return (
      <Card className={`overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group ${getCardStyles()}`}>
        {/* Status Badge */}
        {status === "pending" && (
          <div className="absolute top-3 right-3 z-10">
            <Badge variant="outline" className="bg-amber-100 border-amber-300 text-amber-800">
              <Clock className="h-3 w-3 mr-1" />
              Pending
            </Badge>
          </div>
        )}
        
        {isSelected && (
          <div className="absolute top-3 right-3 z-10">
            <Badge className="bg-emerald-600 hover:bg-emerald-700 shadow-lg">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Selected
            </Badge>
          </div>
        )}

        {/* Image Section with overlay */}
        <div className="relative h-48 bg-gradient-to-br from-emerald-100 to-blue-100 group-hover:from-emerald-200 group-hover:to-blue-200 transition-all duration-300">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Utensils className="h-8 w-8 text-emerald-600" />
              </div>
              <div className="text-sm font-medium text-slate-700 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full">
                {format(new Date(menu.menudate), 'MMM dd')}
              </div>
            </div>
          </div>
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
        </div>

        <CardContent className="p-6 space-y-4">
          {/* Menu name with better typography */}
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-900 line-clamp-2 group-hover:text-emerald-600 transition-colors duration-200">
              {menu.menuname}
            </h3>
            <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">
              {menu.description}
            </p>
          </div>

          {/* Date and status info */}
          <div className="flex items-center gap-2 text-sm">
            <CalendarDays className="h-4 w-4 text-slate-400" />
            <span className="text-slate-600">
              {format(new Date(menu.menudate), 'EEEE, MMMM dd, yyyy')}
            </span>
          </div>

          {/* Action buttons */}
          {!isPast && (
            <div className="flex gap-3 pt-2">
              {isSelected ? (
                <div className="flex-1 flex items-center gap-2 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span className="text-emerald-700 font-medium text-sm">Selected for today</span>
                </div>
              ) : (
                <Button 
                  onClick={() => handleAddMenu(user?.id, menu.id)}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 group"
                  disabled={!isActive}
                >
                  <Plus className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                  {isActive ? 'Select Meal' : 'Unavailable'}
                </Button>
              )}
              
              {user?.role === 'admin' && (
                <UpdateButton item={menu} className="shrink-0" />
              )}
            </div>
          )}
          
          {/* Past selection indicator */}
          {isSelected && isPast && (
            <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 p-3 rounded-lg">
              <Info className="h-4 w-4" />
              <span className="italic">You selected this menu</span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      <div className="container py-8 space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/70 backdrop-blur-sm rounded-full border border-emerald-200 shadow-lg">
            <Utensils className="h-6 w-6 text-emerald-600" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Today&apos;s Menu Selection
            </h1>
            <Sparkles className="h-5 w-5 text-yellow-500" />
          </div>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Choose from our carefully curated selection of delicious meals prepared by our expert chefs
          </p>
        </div>
        
        {/* Weekly Planning Card */}
        <div className="transform hover:scale-[1.02] transition-transform duration-300">
          <WeeklyPlanningCard />
        </div>
        
        {/* Active Menus Section */}
        {activeMenus.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-8 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-full shadow-lg"></div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Today&apos;s Fresh Options
                </h2>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-emerald-200 to-transparent"></div>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-emerald-200">
                <TrendingUp className="h-3 w-3 mr-1" />
                {activeMenus.length} Available
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeMenus.map((menu, index) => (
                <div
                  key={menu.id}
                  className="opacity-0 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
                >
                  <MenuCard menu={menu} status="active" />
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Pending Menus Section (Admin Only) */}
        {user?.role === 'admin' && pendingMenus.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-8 bg-gradient-to-b from-amber-500 to-orange-600 rounded-full shadow-lg"></div>
                <h2 className="text-2xl font-bold text-slate-800">Upcoming Menus</h2>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-amber-200 to-transparent"></div>
              <Badge variant="outline" className="border-amber-300 text-amber-700">
                <Clock className="h-3 w-3 mr-1" />
                {pendingMenus.length} Pending
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pendingMenus.map((menu, index) => (
                <div
                  key={menu.id}
                  className="opacity-0 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
                >
                  <MenuCard menu={menu} status="pending" />
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Past Menus Section */}
        {pastMenus.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-8 bg-gradient-to-b from-slate-400 to-slate-500 rounded-full shadow-lg"></div>
                <h2 className="text-2xl font-bold text-slate-600">Past Selections</h2>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent"></div>
              <Badge variant="outline" className="border-slate-300 text-slate-600">
                {pastMenus.length} Past
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pastMenus.slice(0, 8).map((menu, index) => (
                <div
                  key={menu.id}
                  className="opacity-0 animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
                >
                  <MenuCard menu={menu} status="past" />
                </div>
              ))}
            </div>
            
            {pastMenus.length > 8 && (
              <div className="text-center">
                <Button variant="outline" className="hover:bg-slate-50">
                  View {pastMenus.length - 8} More Past Menus
                </Button>
              </div>
            )}
          </div>
        )}
        
        {/* Admin Actions */}
        {user?.role === 'admin' && (
          <div className="text-center pt-8 border-t border-slate-200">
            <AddMenuButton />
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuTable;
