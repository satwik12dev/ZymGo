import { useEffect, useState } from "react";

import Sidebar from "../../components/gym/Sidebar";
import Header from "../../components/Header";

import GymHeader from "../../components/gym/GymHeader";
import GymStats from "../../components/gym/GymStats";
import GymFilters from "../../components/gym/GymFilters";
import GymTable from "../../components/gym/GymTable";
import Pagination from "../../components/gym/Pagination";

import { getGymList } from "../../lib/gymApi";

export default function GymList() {
  const [loading, setLoading] = useState(false);

  const [gyms, setGyms] = useState([]);
  const [stats, setStats] = useState({});
  const [pagination, setPagination] = useState({});
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: "",
    state: "",
    city: "",
    approval: "",
    status: "",
  });

  useEffect(() => {
    fetchGyms();
  }, [filters]);

  const fetchGyms = async () => {
    try {
      setLoading(true);

      const { data } = await getGymList(filters);

      if (data.success) {
        setGyms(data.gyms || []);
        setStats(data.stats || {});
        setPagination(data.pagination || {});
        setStates(data.filters?.states || []);
        setCities(data.filters?.cities || []);
      }
    } catch (err) {
      console.log(err);
      setGyms([]);
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen bg-[#F6F8FC]">

    {/* Sidebar */}
    <Sidebar />

    {/* Main Content */}
    <div className="pt-16 lg:pt-0 lg:ml-[320px] transition-all duration-300">

      {/* Header */}
      <Header />

      {/* Page */}
      <main className="p-4 sm:p-6 lg:p-8">

        <div className="max-w-[1700px] mx-auto space-y-7">

          <GymHeader />

          <GymStats stats={stats} />

          <GymFilters
            filters={filters}
            setFilters={setFilters}
            states={states}
            cities={cities}
          />

          <GymTable
            gyms={gyms}
            loading={loading}
            pagination={pagination}
          />

          <Pagination
            pagination={pagination}
            filters={filters}
            setFilters={setFilters}
          />

        </div>

      </main>

    </div>

  </div>
);
}