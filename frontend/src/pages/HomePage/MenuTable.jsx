import { useEffect, useState } from "react";
import { 
  Badge, 
  Button, 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui";
import { 
  CheckCircle2, 
  Clock, 
  Plus, 
  XCircle, 
  Utensils,
  CalendarDays,
  Info,
  Check
} from "lucide-react";
import { format, isToday, isBefore, isAfter, isSameDay } from "date-fns";
import { fetchMenuData } from "@/hooks/fetchMenuData";
import { fetchLunchData } from "@/hooks/fetchLunchData";
import UpdateButton from "./UpdateButton";
import { useAuth } from "../../contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

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
      const response = await fetch(`http://localhost:3001/lunchChoice/add`, {
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

  // Handle removing a menu selection
  const handleRemove = async (menuId) => {
    const selection = lunchData.find(lunch => lunch.menuid === menuId && lunch.userid === user?.id);
    if (!selection) return;
    
    try {
      const response = await fetch(`http://localhost:3001/lunchChoice/${selection.id}`, {
        method: "DELETE",
      });
      
      const result = await response.json();
      if (result.status === "success") {
        await Promise.all([
          fetchMenuData(setMenuData),
          fetchLunchData(setLunchData)
        ]);
      } else {
        console.error("Error:", result.error);
      }
    } catch (error) {
      console.error("Error removing selection:", error);
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
  const MenuCard = ({ menu, status }) => {
    const isSelected = isMenuSelected(menu.id);
    const isPast = isBefore(new Date(menu.menudate), new Date());
    const isActive = menu.isactive;
    
    return (
      <Card className="overflow-hidden transition-all hover:shadow-lg">
        <div className={`p-4 ${isActive ? 'bg-emerald-50' : 'bg-slate-50'} border-b`}>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{menu.menuname}</h3>
              <div className="flex items-center mt-1 text-sm text-slate-500">
                <CalendarDays className="h-4 w-4 mr-1.5" />
                {formatDate(menu.menudate)}
              </div>
            </div>
            <div>
              {isActive ? (
                <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 mr-1.5"></div>
                    Active
                  </div>
                </Badge>
              ) : isPast ? (
                <Badge variant="outline" className="text-slate-500">
                  Past
                </Badge>
              ) : (
                <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    Upcoming
                  </div>
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <CardContent className="p-4">
          {menu.description ? (
            <p className="text-slate-600 mb-4">{menu.description}</p>
          ) : (
            <div className="flex items-center text-slate-400 text-sm mb-4">
              <Info className="h-4 w-4 mr-1.5 flex-shrink-0" />
              <span>No description provided</span>
            </div>
          )}
          
          {isActive && (
            <div className="flex justify-between items-center">
              {isSelected ? (
                <div className="flex items-center text-emerald-600">
                  <CheckCircle2 className="h-5 w-5 mr-1.5" />
                  <span>Selected</span>
                </div>
              ) : (
                <Button 
                  onClick={() => handleAddMenu(user?.id, menu.id)}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Plus className="h-4 w-4 mr-1.5" />
                  Select Meal
                </Button>
              )}
              
              {user?.role === 'admin' && (
                <UpdateButton item={menu} />
              )}
            </div>
          )}
          
          {isSelected && !isActive && (
            <div className="text-sm text-slate-500 italic">
              You selected this menu
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container py-8">
      {/* Active Menus Section */}
      {activeMenus.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-8 bg-emerald-500 rounded-full"></div>
            <h2 className="text-2xl font-bold text-slate-900">Today's Options</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeMenus.map(menu => (
              <MenuCard key={menu.id} menu={menu} status="active" />
            ))}
          </div>
        </div>
      )}
      
      {/* Pending Menus Section (Admin Only) */}
      {user?.role === 'admin' && pendingMenus.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-8 bg-amber-400 rounded-full"></div>
            <h2 className="text-2xl font-bold text-slate-900">Upcoming Menus</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingMenus.map(menu => (
              <MenuCard key={menu.id} menu={menu} status="pending" />
            ))}
          </div>
        </div>
      )}
      
      {/* Past Menus Section */}
      {pastMenus.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-8 bg-slate-300 rounded-full"></div>
            <h2 className="text-2xl font-bold text-slate-900">Past Menus</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastMenus.map(menu => (
              <MenuCard key={menu.id} menu={menu} status="past" />
            ))}
          </div>
        </div>
      )}
      
      {/* Add Menu Button (Admin) */}
      {user?.role === 'admin' && (
        <div className="mt-12 text-center">
          <AddMenuButton />
        </div>
      )}
    </div>
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
