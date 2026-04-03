import { Building2, LayoutDashboard, DoorOpen, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const items = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "properties", label: "Properties", icon: Building2 },
  { key: "listings", label: "Listings", icon: DoorOpen },
];

export default function DashboardSidebar({ active, setActive }) {
  const { logout } = useAuth();

  const handleLogout = () => {
    console.log("Logging out...");
    logout();
  };

  return (
    <aside
      id="dashboard-sidebar"
      className="h-full p-4 space-y-2 border-r border-border bg-card"
    >
      <h2
        id="dashboard-sidebar-title"
        className="text-xl font-bold mb-6"
      >
       House provider Panel
      </h2>

      <div id="dashboard-sidebar-items" className="space-y-1">
        {items.map((item) => (
          <button
            key={item.key}
            id={`sidebar-item-${item.key}`}
            onClick={() => setActive(item.key)}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition
              ${
                active === item.key
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </div>

      {/* Logout button (mobile only) */}
      <Button
        id="sidebar-logout-mobile"
        onClick={handleLogout}
        variant="ghost"
        className="mt-6 w-full justify-start gap-2 text-destructive sm:hidden"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </Button>
    </aside>
  );
}
