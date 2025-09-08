import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Search, UserRound, CalendarCheck2, PlusCircle, BarChart3, LayoutGrid, LogOutIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { BiLogoCss3 } from "react-icons/bi";

const navItems = [
  { to: "/patientDashboard", label: "Dashboard", icon: LayoutGrid },
  { to: "/patientDashboard/appointments", label: "Appointments", icon: CalendarCheck2 },
  // { to: "/patientDashboard/add-patient", label: "Add a patient", icon: PlusCircle },
  { to: "/patientDashboard/reports", label: "Reports", icon: BarChart3 },
  { to: "/logout", label: "Logout", icon: LogOutIcon },
];

function Sidebar() {
  const location = useLocation();
  return (
    <aside className="hidden lg:flex lg:w-64 xl:w-72 flex-col border-r bg-white">
      <Link to="/patientDashboard" className="flex items-center gap-2 px-6 py-6">
        <div className="h-8 w-8 rounded-lg bg-primary/10 grid place-items-center">
          <span className="text-primary font-black">M</span>
        </div>
        <span className="font-extrabold tracking-tight text-lg text-foreground">MEDICURE</span>
      </Link>
      <nav className="px-2 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium",
                isActive || location.pathname === to
                  ? "bg-primary/10 text-primary"
                  : "text-foreground/70 hover:bg-muted hover:text-foreground",
              )
            }
            end={to === "/"}
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto px-6 py-6 text-xs text-muted-foreground">
        <p className="font-medium">Resources</p>
        <div className="mt-2 space-x-4">
          <a href="#" className="hover:text-foreground">Legal</a>
          <a href="#" className="hover:text-foreground">Contact Us</a>
        </div>
      </div>
    </aside>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-30 h-16 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative hidden sm:block max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search" className="pl-9" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button aria-label="notifications" className="relative rounded-md p-2 hover:bg-muted">
            <Bell className="h-5 w-5 text-foreground/80" />
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-primary"></span>
          </button>
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src="https://i.pravatar.cc/100?img=5" alt="User" />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-[#f7f8fa] text-foreground">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 min-w-0">
          <Header />
          <main className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
