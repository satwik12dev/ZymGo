import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  Wallet,
  FileText,
  Newspaper,
  BarChart3,
  ClipboardList,
  ShieldCheck,
  Settings,
  Dumbbell,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    title: "Members",
    icon: Users,
    children: [
      { title: "Member List", path: "/members/list" },
      { title: "Add Member", path: "/members/add" },
      { title: "Gym List", path: "/members/gyms" },
      { title: "Onboarding Performance", path: "/members/performance" },
      { title: "Bulk Upload Gym", path: "/members/bulk-upload" },
      { title: "Subscription Plans", path: "/members/plans" },
      { title: "Subscription Audit", path: "/members/audit" },
    ],
  },
  {
    title: "Finance",
    icon: Wallet,
    children: [
      { title: "Invoices", path: "/finance/invoices" },
      { title: "Advance Reports", path: "/finance/reports" },
      { title: "Payments", path: "/finance/payments" },
      { title: "Campaigns", path: "/finance/campaigns" },
    ],
  },
  {
    title: "Content",
    icon: FileText,
    children: [
      { title: "Banner", path: "/content/banner" },
      { title: "Categories", path: "/content/category" },
      { title: "Sub Categories", path: "/content/subcategory" },
    ],
  },
  {
    title: "Blog Management",
    icon: Newspaper,
    children: [
      { title: "All Blogs", path: "/blogs" },
      { title: "Create Blog", path: "/blogs/create" },
    ],
  },
  {
    title: "Gym Analytics",
    icon: BarChart3,
    path: "/analytics",
  },
  {
    title: "Reports",
    icon: ClipboardList,
    path: "/reports",
  },
  {
    title: "Administration",
    icon: ShieldCheck,
    children: [
      { title: "Admins", path: "/administration/admins" },
      {
        title: "Roles & Permissions",
        path: "/administration/roles&permissions",
      },
      {
        title: "Audit Trail",
        path: "/administration/audittrail",
      },
    ],
  },
  {
    title: "Settings",
    icon: Settings,
    children: [
      {
        title: "Email Settings",
        path: "/settings/emailSettings",
      },
      {
        title: "Communication Settings",
        path: "/settings/communicationSettings",
      },
      {
        title: "Email Templates",
        path: "/settings/template",
      },
      {
        title: "Email Logs",
        path: "/settings/logs",
      },
    ],
  },
];

export default function Sidebar() {
  const [openMenu, setOpenMenu] = useState("Members");
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Header */}

      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#111827] z-50 flex items-center justify-between px-5">

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-xl bg-orange-500 flex items-center justify-center">
            <Dumbbell className="text-white" size={22} />
          </div>

          <div>
            <h2 className="text-white font-bold text-lg">
              Zymgoo CRM
            </h2>

            <p className="text-gray-400 text-xs">
              Admin Panel
            </p>
          </div>

        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-white"
        >
          {mobileOpen ? <X size={30} /> : <Menu size={30} />}
        </button>

      </div>

      {/* Overlay */}

      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}

      <aside
        className={`
fixed
top-0
left-0
z-50
h-screen
w-[320px]
bg-[#111827]
border-r
border-gray-800
flex
flex-col
transition-transform
duration-300

${mobileOpen ? "translate-x-0" : "-translate-x-full"}

lg:translate-x-0
`}
      >

        {/* Logo */}

        <div className="h-24 flex items-center px-8 border-b border-gray-800">

          <div className="w-14 h-14 rounded-2xl bg-orange-500 flex items-center justify-center shadow-xl">

            <Dumbbell
              size={28}
              className="text-white"
            />

          </div>

          <div className="ml-4">

            <h1 className="text-2xl font-bold text-white">
              Zymgoo CRM
            </h1>

            <p className="text-sm text-gray-400 mt-1">
              Admin Dashboard
            </p>

          </div>

        </div>

        {/* Navigation */}

        <div className="flex-1 overflow-y-auto px-4 py-6">

          <p className="px-4 mb-5 text-xs uppercase tracking-[3px] text-gray-500">

            Main Menu

          </p>

          <nav className="space-y-2">

            {menuItems.map((item) => {

              const Icon = item.icon;

              if (!item.children) {

                return (

                  <NavLink
                    key={item.title}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-4 rounded-2xl px-5 py-4 transition-all duration-200 ${
                        isActive
                          ? "bg-orange-500 text-white shadow-lg"
                          : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      }`
                    }
                  >

                    <Icon size={22} />

                    <span className="text-[16px] font-medium">

                      {item.title}

                    </span>

                  </NavLink>

                );

              }

              return (

                <div key={item.title}>

                  <button
                    onClick={() =>
                      setOpenMenu(
                        openMenu === item.title
                          ? ""
                          : item.title
                      )
                    }
                    className={`w-full flex items-center justify-between rounded-2xl px-5 py-4 transition-all duration-200 ${
                      openMenu === item.title
                        ? "bg-gray-800 text-white"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`}
                  >

                    <div className="flex items-center gap-4">

                      <Icon size={22} />

                      <span className="text-[16px] font-medium">

                        {item.title}

                      </span>

                    </div>

                    {openMenu === item.title ? (
                      <ChevronDown size={20} />
                    ) : (
                      <ChevronRight size={20} />
                    )}

                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openMenu === item.title
                        ? "max-h-[600px]"
                        : "max-h-0"
                    }`}
                  >

                    <div className="ml-10 mt-2 space-y-2"></div>
                                          {item.children.map((child) => (
                        <NavLink
                          key={child.title}
                          to={child.path}
                          onClick={() => setMobileOpen(false)}
                          className={({ isActive }) =>
                            `block rounded-xl px-5 py-3 text-[15px] font-medium transition-all duration-200 ${
                              isActive
                                ? "bg-orange-500 text-white shadow-md"
                                : "text-gray-400 hover:bg-gray-800 hover:text-white"
                            }`
                          }
                        >
                          {child.title}
                        </NavLink>
                      ))}

                    </div>

                  </div>


              );

            })}

          </nav>

        </div>

        {/* Bottom Profile */}

        <div className="border-t border-gray-800 p-6">

          <div className="flex items-center gap-4">

            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
              K
            </div>

            <div className="flex-1">

              <h3 className="text-white text-lg font-semibold">
                Kodexive Gym
              </h3>

              <p className="text-sm text-gray-400">
                Super Admin
              </p>

            </div>

          </div>

          <button
            className="
              mt-6
              w-full
              rounded-2xl
              bg-gray-800
              py-4
              text-white
              font-semibold
              hover:bg-red-600
              transition-all
              duration-300
            "
          >
            Logout
          </button>

        </div>

      </aside>

    </>

  );

}