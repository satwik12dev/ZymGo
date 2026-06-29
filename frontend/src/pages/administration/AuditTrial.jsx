import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
    Search,
    RotateCcw,
    CalendarDays,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    LayoutDashboard,
    Users,
    CreditCard,
    FileText,
    BookOpen,
    BarChart2,
    FileBarChart,
    Settings,
    Shield,
    Clock,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";

export default function AuditTrail() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const [fromDate, setFromDate] = useState("05/30/2026");
    const [toDate, setToDate] = useState("06/29/2026");
    const [module, setModule] = useState("All");
    const [action, setAction] = useState("All");
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 20;

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const res = await axios.get(
                "http://localhost:3000/admin/logs",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setLogs(res.data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredLogs = useMemo(() => {
        return logs.filter((log) => {
            const keyword =
                search === "" ||
                log.name?.toLowerCase().includes(search.toLowerCase()) ||
                log.email?.toLowerCase().includes(search.toLowerCase()) ||
                log.ip_address?.includes(search);

            const actionFilter =
                action === "All" || log.action === action;

            const moduleFilter =
                module === "All" || log.module === module;

            const logDate = new Date(log.created_at)
                .toISOString()
                .split("T")[0];

            const from =
                !fromDate || logDate >= fromDate;

            const to =
                !toDate || logDate <= toDate;

            return (
                keyword &&
                actionFilter &&
                moduleFilter &&
                from &&
                to
            );
        });
    }, [
        logs,
        search,
        action,
        module,
        fromDate,
        toDate,
    ]);

    const loginCount = filteredLogs.filter(
        (l) => l.action === "LOGIN"
    ).length;

    const logoutCount = filteredLogs.filter(
        (l) => l.action === "LOGOUT"
    ).length;

    const failedCount = filteredLogs.filter(
        (l) => l.status === "FAILED"
    ).length;

    const totalPages = Math.ceil(
        filteredLogs.length / rowsPerPage
    );

    const displayedLogs = filteredLogs.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const exportCSV = () => {
        const headers = [
            "Name",
            "Email",
            "Role",
            "Action",
            "IP",
            "Status",
            "Time"
        ];

        const rows = filteredLogs.map((l) => [
            l.name,
            l.email,
            l.role,
            l.action,
            l.ip_address,
            l.status,
            l.created_at
        ]);

        const csv = [
            headers,
            ...rows
        ]
            .map((e) => e.join(","))
            .join("\n");

        const blob = new Blob(
            [csv],
            {
                type: "text/csv"
            }
        );

        const url =
            window.URL.createObjectURL(blob);

        const a =
            document.createElement("a");

        a.href = url;
        a.download = "audit_logs.csv";
        a.click();
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar/>

            {/* Main Content */}
            <div className="ml-64 flex-1">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 px-8 py-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                                Audit Trail
                                <span className="text-sm font-normal text-gray-400 ml-4">
                                    Monday, June 29, 2026
                                </span>
                            </h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={fetchLogs}
                                className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                            >
                                <RefreshCw size={16} />
                                Refresh
                            </button>
                            <button
                                onClick={exportCSV}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                            >
                                Export CSV
                            </button>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6">
                    <p className="text-gray-600 mb-6">
                        Admin actions, automation logs, and activity records
                    </p>

                    {/* Filter Card */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4">
                            {/* From */}
                            <div>
                                <label className="text-sm font-semibold text-gray-600 block mb-1.5">
                                    From
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={fromDate}
                                        onChange={(e) =>
                                            setFromDate(e.target.value)
                                        }
                                        className="w-full h-10 rounded-lg border border-gray-300 px-3 pr-10 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm"
                                    />
                                    <CalendarDays
                                        size={16}
                                        className="absolute right-3 top-3 text-gray-400"
                                    />
                                </div>
                            </div>

                            {/* To */}
                            <div>
                                <label className="text-sm font-semibold text-gray-600 block mb-1.5">
                                    To
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={toDate}
                                        onChange={(e) =>
                                            setToDate(e.target.value)
                                        }
                                        className="w-full h-10 rounded-lg border border-gray-300 px-3 pr-10 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm"
                                    />
                                    <CalendarDays
                                        size={16}
                                        className="absolute right-3 top-3 text-gray-400"
                                    />
                                </div>
                            </div>

                            {/* Module */}
                            <div>
                                <label className="text-sm font-semibold text-gray-600 block mb-1.5">
                                    Module
                                </label>
                                <select
                                    value={module}
                                    onChange={(e) =>
                                        setModule(e.target.value)
                                    }
                                    className="w-full h-10 rounded-lg border border-gray-300 px-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm bg-white"
                                >
                                    <option>All</option>
                                    <option>Authentication</option>
                                    <option>Members</option>
                                    <option>Finance</option>
                                    <option>Administration</option>
                                </select>
                            </div>

                            {/* Action */}
                            <div>
                                <label className="text-sm font-semibold text-gray-600 block mb-1.5">
                                    Action
                                </label>
                                <select
                                    value={action}
                                    onChange={(e) =>
                                        setAction(e.target.value)
                                    }
                                    className="w-full h-10 rounded-lg border border-gray-300 px-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm bg-white"
                                >
                                    <option>All</option>
                                    <option>LOGIN</option>
                                    <option>LOGOUT</option>
                                    <option>CREATE</option>
                                    <option>UPDATE</option>
                                    <option>DELETE</option>
                                </select>
                            </div>

                            {/* Search */}
                            <div className="xl:col-span-2">
                                <label className="text-sm font-semibold text-gray-600 block mb-1.5">
                                    Search
                                </label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Search
                                            size={16}
                                            className="absolute left-3 top-3 text-gray-400"
                                        />
                                        <input
                                            type="text"
                                            placeholder="admin, ip, desc"
                                            value={search}
                                            onChange={(e) =>
                                                setSearch(e.target.value)
                                            }
                                            className="w-full h-10 rounded-lg border border-gray-300 pl-9 pr-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm"
                                        />
                                    </div>
                                    <button
                                        onClick={() => {
                                            setSearch("");
                                            setAction("All");
                                            setModule("All");
                                            setFromDate("05/30/2026");
                                            setToDate("06/29/2026");
                                        }}
                                        className="px-4 h-10 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-sm font-medium"
                                    >
                                        Reset
                                    </button>
                                    <button className="px-4 h-10 rounded-lg bg-orange-500 hover:bg-orange-600 text-white transition-colors text-sm font-medium">
                                        Apply
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                            <h3 className="text-sm font-medium text-gray-500">Total Logins</h3>
                            <p className="text-3xl font-bold text-green-600 mt-2">
                                {loginCount}
                            </p>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                            <h3 className="text-sm font-medium text-gray-500">Total Logouts</h3>
                            <p className="text-3xl font-bold text-red-600 mt-2">
                                {logoutCount}
                            </p>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                            <h3 className="text-sm font-medium text-gray-500">Failed Attempts</h3>
                            <p className="text-3xl font-bold text-orange-500 mt-2">
                                {failedCount}
                            </p>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Time
                                        </th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Admin
                                        </th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Module
                                        </th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Action
                                        </th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Description
                                        </th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            IP
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan={6} className="py-12 text-center">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                                                    <p className="mt-3 text-gray-500 text-sm">Loading Logs...</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredLogs.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="py-12 text-center text-gray-500 text-sm">
                                                No Audit Logs Found
                                            </td>
                                        </tr>
                                    ) : (
                                        displayedLogs.map((log, index) => (
                                            <tr key={log.id || index} className="border-b border-gray-100 hover:bg-orange-50 transition-colors">
                                                <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                                                    {new Date(log.created_at).toLocaleString()}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-semibold">
                                                            {log.name?.charAt(0) || 'A'}
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-800">
                                                            {log.name || 'Unknown'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-600">
                                                    {log.module || 'Authentication'}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                                                        ${log.action === "LOGIN" ? "bg-green-100 text-green-700" :
                                                          log.action === "LOGOUT" ? "bg-red-100 text-red-700" :
                                                          log.action === "CREATE" ? "bg-blue-100 text-blue-700" :
                                                          log.action === "UPDATE" ? "bg-yellow-100 text-yellow-700" :
                                                          "bg-gray-100 text-gray-700"}
                                                    `}>
                                                        {log.action || 'VIEW'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-600">
                                                    {log.description || `${log.action} performed by ${log.name}`}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-600">
                                                    {log.ip_address || '192.168.1.1'}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {filteredLogs.length > 0 && (
                            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
                                <p className="text-sm text-gray-600">
                                    Showing {displayedLogs.length} of {filteredLogs.length} logs
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(currentPage - 1)}
                                        className="p-2 rounded-lg border border-gray-300 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    <span className="px-3 py-1 text-sm font-medium">
                                        {currentPage} / {totalPages}
                                    </span>
                                    <button
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(currentPage + 1)}
                                        className="p-2 rounded-lg border border-gray-300 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="mt-6 flex items-center justify-between text-sm text-gray-500 border-t border-gray-200 pt-4">
                        <span>© 2026 Kodexive Gym</span>
                        <span>Super Admin</span>
                    </div>
                </div>
            </div>
        </div>
    );
}