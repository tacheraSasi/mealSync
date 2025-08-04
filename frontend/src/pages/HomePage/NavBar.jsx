import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../contexts/AuthContext";
import { 
  Users, 
  Utensils, 
  ClipboardList, 
  Menu, 
  User, 
  LogOut,
  ChevronDown,
  Calendar
} from "lucide-react";

const NavBar = ({ setActive }) => {
  const { user, logout } = useAuth();
  
  const handleLogout = () => {
    logout();
  };
  
  return (
    <nav className="bg-slate-900 py-4 border-b border-slate-800">
      <div className="container flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Utensils className="text-emerald-400 h-6 w-6" />
          <span className="text-xl font-bold text-white">MealSync</span>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-6">
          {user?.role === "admin" && (
            <Button 
              onClick={() => setActive({ menu: false, user: true, choice: false, weeklyPlans: false })}
              variant="ghost"
              className="text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2"
            >
              <Users size={18} /> Users
            </Button>
          )}
          <Button 
            onClick={() => setActive({ menu: true, user: false, choice: false, weeklyPlans: false })}
            variant="ghost"
            className="text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2"
          >
            <Utensils size={18} /> Menus
          </Button>
          {user?.role === "admin" && (
            <>
              <Button 
                onClick={() => setActive({ menu: false, user: false, choice: true, weeklyPlans: false })}
                variant="ghost"
                className="text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2"
              >
                <ClipboardList size={18} /> Choices
              </Button>
              <Button 
                onClick={() => setActive({ menu: false, user: false, choice: false, weeklyPlans: true })}
                variant="ghost"
                className="text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2"
              >
                <Calendar size={18} /> Weekly Plans
              </Button>
            </>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-slate-300 hover:bg-slate-800">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-slate-800 border-slate-700 text-slate-200">
              <DropdownMenuItem 
                onClick={() => setActive({ menu: true, user: false, choice: false, weeklyPlans: false })}
                className="flex items-center gap-2 hover:bg-slate-700 cursor-pointer"
              >
                <Utensils size={16} /> Menus
              </DropdownMenuItem>
              {user?.role === "admin" && (
                <>
                  <DropdownMenuItem 
                    onClick={() => setActive({ menu: false, user: true, choice: false, weeklyPlans: false })}
                    className="flex items-center gap-2 hover:bg-slate-700 cursor-pointer"
                  >
                    <Users size={16} /> Users
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setActive({ menu: false, user: false, choice: true, weeklyPlans: false })}
                    className="flex items-center gap-2 hover:bg-slate-700 cursor-pointer"
                  >
                    <ClipboardList size={16} /> Choices
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setActive({ menu: false, user: false, choice: false, weeklyPlans: true })}
                    className="flex items-center gap-2 hover:bg-slate-700 cursor-pointer"
                  >
                    <Calendar size={16} /> Weekly Plans
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 text-slate-200 hover:text-white transition-colors">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center">
                <User className="h-4 w-4 text-slate-300" />
              </div>
              <span className="hidden md:inline font-medium">{user?.username}</span>
              <ChevronDown className="h-4 w-4 hidden md:inline" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-slate-800 border-slate-700 text-slate-200">
            <DropdownMenuItem 
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-400 hover:bg-slate-700 cursor-pointer"
            >
              <LogOut size={16} /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default NavBar;
