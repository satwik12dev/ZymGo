import { useState, useRef, useEffect } from "react";
import {
  User,
  Settings,
  LogOut,
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

import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

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

      navigate("/");
    } catch (error) {
      console.error(error);

      // Even if logout API fails, clear local data
      localStorage.removeItem("token");
      localStorage.removeItem("admin");

      navigate("/");
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3"
      >
        <div className="w-10 h-10 rounded-full bg-violet-500 flex items-center justify-center text-white font-semibold text-base">
          KO
        </div>

        <div className="hidden md:block text-left">
          <h3 className="text-base font-semibold text-gray-900 leading-none">
            Kodexive Gym
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            Super Admin
          </p>
        </div>

        <ChevronDown
          size={18}
          className={`text-gray-500 transition-transform duration-200 ${open ? "rotate-180" : ""
            }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden z-50">
          <button className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition">
            <User size={18} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              Profile
            </span>
          </button>

          <button className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition">
            <Settings size={18} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              Email Settings
            </span>
          </button>

          <div className="border-t border-gray-200" />

          <button
            onClick={() => {
              setOpen(false);
              setShowLogoutDialog(true);
            }}
            className="w-full flex items-center gap-3 px-5 py-4 hover:bg-red-50 transition"
          >
            <LogOut size={18} className="text-red-500" />

            <span className="text-sm font-semibold text-red-500">
              Logout
            </span>
          </button>
        </div>
      )}

      <AlertDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Confirm Logout
            </AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to logout?
              You will need to login again to access your account.
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
  );
}