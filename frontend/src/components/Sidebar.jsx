import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { useNavigate } from "react-router-dom";
import axios from "axios"

const admin = JSON.parse(localStorage.getItem("admin"));
const role = admin?.role;
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
            {
                heading: "Banners",
            },
            {
                title: "Add Banner",
                path: "/content/banner/add",
            },
            {
                title: "All Banners",
                path: "/content/banner/all",
            },
            {
                title: "Update Banner",
                path: "/content/banner/update",
            },

            {
                heading: "Categories",
            },
            {
                title: "Add Category",
                path: "/content/category/add",
            },
            {
                title: "All Categories",
                path: "/content/category/all",
            },
            {
                title: "Add Sub Category",
                path: "/content/subcategory/add",
            },
            {
                title: "All Sub Categories",
                path: "/content/subcategory/all",
            },
        ],
    },
    {
        title: "Blog Management",
        icon: Newspaper,
        children: [
            { title: "All Blogs", path: "/blogs" },
            { title: "Add New Blog", path: "/blogs/create" },
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
        { title: "Roles & Permissions", path: "/administration/roles&permissions" },
        { title: "Audit Trail", path: "/administration/audittrail" }
        ]
},
    {
        title: "Settings",
        icon: Settings,
        children: [
            { title: "Email Settings", path: "/settings/emailSettings" },
            { title: "Communication Settings", path: "/settings/communicationSettings" },
            { title: "Email Templates", path: "/settings/template" },
            { title: "Enail Logs", path: "/settings/logs" }
        ],
    },
];

export default function Sidebar() {
    const [openMenu, setOpenMenu] = useState("Members");
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem("token");

            await axios.post(
                "http://localhost:3000/admin/logout",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            localStorage.removeItem("token");
            localStorage.removeItem("admin");

            navigate("/")
        } catch (error) {
            console.error(error);

            // Clear local storage even if API fails
            localStorage.removeItem("token");
            localStorage.removeItem("admin");

            navigate("/");
        }
    };

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-[#111827] border-r border-gray-800 flex flex-col">

            {/* Logo */}

            <div className="h-20 flex items-center px-6 border-b border-gray-800">

                <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center">

                    <Dumbbell size={20} className="text-white" />

                </div>

                <div className="ml-3">

                    <h1 className="text-lg font-bold text-white">
                        Zymgoo CRM
                    </h1>

                    <p className="text-xs text-gray-400">
                        Admin Panel
                    </p>

                </div>

            </div>

            {/* Menu */}

            <div className="flex-1 overflow-y-auto px-3 py-5">

                <p className="px-3 mb-3 text-[11px] uppercase tracking-widest text-gray-500">
                    Main Menu
                </p>

                <nav className="space-y-1">

                    {menuItems.map((item) => {

                        const Icon = item.icon;

                        if (item.children) {

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
                                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 ${openMenu === item.title
                                            ? "bg-gray-800 text-white"
                                            : "text-gray-300 hover:bg-gray-800 hover:text-white"
                                            }`}
                                    >

                                        <div className="flex items-center gap-3">

                                            <Icon size={18} />

                                            <span className="text-sm font-medium">
                                                {item.title}
                                            </span>

                                        </div>

                                        {openMenu === item.title ? (
                                            <ChevronDown size={16} />
                                        ) : (
                                            <ChevronRight size={16} />
                                        )}

                                    </button>

                                    <div
                                        className={`overflow-hidden transition-all duration-300 ${openMenu === item.title
                                            ? "max-h-96"
                                            : "max-h-0"
                                            }`}
                                    >

                                        <div className="ml-8 mt-2 space-y-1">

                                            {item.children.map((child, index) => {

                                                // Section Heading
                                                if (child.heading) {
                                                    return (
                                                        <p
                                                            key={index}
                                                            className="px-3 pt-3 pb-1 text-xs font-semibold uppercase tracking-wider text-gray-500"
                                                        >
                                                            {child.heading}
                                                        </p>
                                                    );
                                                }

                                                return (
                                                    <NavLink
                                                        key={child.title}
                                                        to={child.path}
                                                        className={({ isActive }) =>
                                                            `block rounded-lg px-3 py-2 text-sm transition-all duration-200 ${isActive
                                                                ? "bg-orange-500 text-white shadow-sm"
                                                                : "text-gray-300 hover:bg-gray-800 hover:text-white"
                                                            }`
                                                        }
                                                    >
                                                        {child.title}
                                                    </NavLink>
                                                );

                                            })}

                                        </div>

                                    </div>

                                </div>
                            );
                        }

                        return (
                            <NavLink
                                key={item.title}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 rounded-lg px-3 py-2.5 transition ${isActive
                                        ? "bg-orange-500 text-white"
                                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                                    }`
                                }
                            >
                                <Icon size={18} />

                                <span className="text-sm font-medium">
                                    {item.title}
                                </span>
                            </NavLink>
                        );
                    })}

                </nav>

            </div>
            {/* Bottom Profile */}

            <div className="border-t border-gray-800 p-4">

                <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold text-sm">
                        K
                    </div>

                    <div className="flex-1">

                        <h3 className="text-sm font-semibold text-white">
                            Kodexive Gym
                        </h3>

                        <p className="text-xs text-gray-400">
                            Super Admin
                        </p>

                    </div>

                </div>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <button className="mt-4 w-full flex items-center justify-center gap-2 rounded-lg bg-gray-800 hover:bg-red-600 text-gray-300 hover:text-white py-2.5 transition">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h5a2 2 0 012 2v1"
                                />
                            </svg>

                            <span className="text-sm font-medium">
                                Logout
                            </span>
                        </button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Confirm Logout
                            </AlertDialogTitle>

                            <AlertDialogDescription>
                                Are you sure you want to logout? You will need to login again to access
                                the dashboard.
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                            <AlertDialogCancel>
                                Cancel
                            </AlertDialogCancel>

                            <AlertDialogAction
                                onClick={handleLogout}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                Logout
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

            </div>

        </aside>
    );
}