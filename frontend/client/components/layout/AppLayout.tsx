import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Bed, ClipboardPlus, Stethoscope, Package, UploadCloud, Sparkles,LogOutIcon } from "lucide-react";

const navItems = [
  { to: "/adminDashboard/opd", label: "OPD Management", icon: Stethoscope },
  { to: "/adminDashboard/doctors", label: "Doctor Available", icon: ClipboardPlus },
  { to: "/adminDashboard", label: "Bed Management", icon: Bed },
  { to: "/adminDashboard/inventory", label: "Inventory", icon: Package },
  { to: "/adminDashboard/upload", label: "Upload Medical Record", icon: UploadCloud },
  { to: "/logout", label: "Logout", icon: LogOutIcon },
];

export default function AdminLayout({ children, headerTitle = "Admin Dashboard" }: { children: ReactNode; headerTitle?: string }) {
  const { pathname } = useLocation();

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <Link to="/" className="flex items-center gap-2 px-2 py-2">
            <div className="size-7 grid place-items-center rounded-md bg-primary text-primary-foreground">
              <Sparkles className="size-4" />
            </div>
            <span className="font-extrabold tracking-tight text-lg">MEDICURE</span>
          </Link>
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.to || (item.to === "/" && pathname === "/");
                  return (
                    <SidebarMenuItem key={item.to}>
                      <Link to={item.to} className="block">
                        <SidebarMenuButton isActive={active}>
                          <Icon />
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b bg-background/60 sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <h1 className="text-base md:text-lg font-semibold">{headerTitle}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="hidden md:inline-flex">Help</Button>
            <Avatar className="size-8">
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </div>
        </div>
        <div className={cn("p-4 md:p-6 max-w-7xl w-full mx-auto")}>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
