import { useState } from "react";
import { Routes, Route, Link, useNavigate, Outlet, NavLink as RouterNavLink } from "react-router-dom";
import { ShoppingCart, Users, RouteIcon, Menu, LayoutDashboard, Cpu, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "./Components/ui/button";
import DashboardPage from "./Pages/Dashboard";
import Orders from "./Pages/Orders";
import Drivers from "./Pages/Driver";
import Routesb from "./Pages/Routesb";
import Simulation from "./Pages/simulations";
import { Sheet, SheetContent, SheetTrigger } from "./Components/ui/sheet";

export default function App() {
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/drivers" element={<Drivers />} />
          <Route path="/routes" element={<Routesb />} />
          <Route path="/simulations" element={<Simulation />} />
        </Route>
      </Routes>
    </div>
  );
}

function MainLayout() {
  const [isManagementOpen, setIsManagementOpen] = useState(false);

  const toggleManagement = () => setIsManagementOpen((prev) => !prev);

  return (
    <div className="flex min-h-screen w-full">
      {/* Desktop Sidebar */}
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px]">
            <Link to="/" className="flex items-center gap-2 font-semibold">
              <span className="text-lg">Delivery Dashboard</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <NavLink to="/" icon={<LayoutDashboard className="h-4 w-4" />}>
                Dashboard
              </NavLink>
              <NavLink to="/simulations" icon={<Cpu className="h-4 w-4" />}>
                Simulation
              </NavLink>

              {/* Collapsible Management */}
              <button
                onClick={toggleManagement}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-muted-foreground hover:text-primary transition-all"
              >
                <span className="flex items-center gap-3">
                  <RouteIcon className="h-4 w-4" />
                  Management
                </span>
                {isManagementOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>

              {isManagementOpen && (
                <div className="ml-8 mt-1 flex flex-col gap-1">
                  <NavLink to="/orders" icon={<ShoppingCart className="h-4 w-4" />}>
                    Orders
                  </NavLink>
                  <NavLink to="/drivers" icon={<Users className="h-4 w-4" />}>
                    Drivers
                  </NavLink>
                  <NavLink to="/routes" icon={<RouteIcon className="h-4 w-4" />}>
                    Routes
                  </NavLink>
                </div>
              )}
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className="flex flex-col md:hidden">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px]">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <NavLink to="/" icon={<LayoutDashboard className="h-5 w-5" />}>
                  Dashboard
                </NavLink>
                <NavLink to="/simulations" icon={<Cpu className="h-5 w-5" />}>
                  Simulation
                </NavLink>

                {/* Collapsible Management */}
                <button
                  onClick={toggleManagement}
                  className="flex items-center justify-between px-2 py-1 rounded-lg text-muted-foreground hover:text-primary transition-all"
                >
                  <span className="flex items-center gap-3">
                    <RouteIcon className="h-5 w-5" />
                    Management
                  </span>
                  {isManagementOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                </button>

                {isManagementOpen && (
                  <div className="ml-8 mt-1 flex flex-col gap-1">
                    <NavLink to="/orders" icon={<ShoppingCart className="h-5 w-5" />}>
                      Orders
                    </NavLink>
                    <NavLink to="/drivers" icon={<Users className="h-5 w-5" />}>
                      Drivers
                    </NavLink>
                    <NavLink to="/routes" icon={<RouteIcon className="h-5 w-5" />}>
                      Routes
                    </NavLink>
                  </div>
                )}
              </nav>
              <div className="mt-auto">{/* Logout button */}</div>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold">Delivery Dashboard</h1>
          </div>
        </header>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <div className="ml-auto flex items-center gap-4">{/* Header actions */}</div>
        </header>

        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function NavLink({ to, icon, children }) {
  return (
    <RouterNavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
          isActive ? "bg-muted text-primary" : "text-muted-foreground"
        }`
      }
    >
      {icon}
      {children}
    </RouterNavLink>
  );
}
