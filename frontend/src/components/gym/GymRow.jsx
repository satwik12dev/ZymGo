import {
  Eye,
  Pencil,
  Trash2,
  BadgeCheck,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Phone,
  Mail,
  Building2,
  Calendar,
} from "lucide-react";

export default function GymRow({ gym }) {
  const initials = gym.gym_name
    ?.split(" ")
    .map((x) => x[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <tr className="hover:bg-orange-50 transition-all duration-200">

      {/* Checkbox */}

      <td className="px-6 py-6">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300"
        />
      </td>

      {/* Gym */}

      <td className="px-6 py-6">

        <div className="flex items-center gap-4">

          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow">

            {initials}

          </div>

          <div>

            <h3 className="font-semibold text-gray-800">

              {gym.gym_name}

            </h3>

            <p className="text-sm text-gray-500 mt-1">

              ID : {gym.gym_id}

            </p>

          </div>

        </div>

      </td>

      {/* Owner */}

      <td className="px-6 py-6">

        <div>

          <h3 className="font-medium text-gray-800">

            {gym.owner_name}

          </h3>

          <p className="text-xs text-gray-500 mt-1">

            Owner

          </p>

        </div>

      </td>

      {/* Contact */}

      <td className="px-6 py-6">

        <div className="space-y-2">

          <div className="flex items-center gap-2">

            <Phone
              size={15}
              className="text-orange-500"
            />

            <span className="text-sm">

              {gym.mobile}

            </span>

          </div>

          <div className="flex items-center gap-2">

            <Mail
              size={15}
              className="text-blue-500"
            />

            <span className="text-sm truncate max-w-[180px]">

              {gym.email || "-"}

            </span>

          </div>

        </div>

      </td>

      {/* Location */}

      <td className="px-6 py-6">

        <div className="space-y-2">

          <div className="flex items-center gap-2">

            <MapPin
              size={15}
              className="text-red-500"
            />

            <span className="font-medium">

              {gym.city}

            </span>

          </div>

          <p className="text-sm text-gray-500">

            {gym.state}

          </p>

        </div>

      </td>

      {/* Gym Type */}

      <td className="px-6 py-6 text-center">

        <span
          className="
          inline-flex
          items-center
          gap-2
          bg-blue-100
          text-blue-700
          px-3
          py-1.5
          rounded-full
          text-xs
          font-semibold
          "
        >
          <Building2 size={14} />

          {gym.gym_type}

        </span>

      </td>

      {/* Approval */}

      <td className="px-6 py-6 text-center">

        <span
          className={`inline-flex px-3 py-1.5 rounded-full text-xs font-semibold

          ${
            gym.admin_approval_status === "approved"
              ? "bg-green-100 text-green-700"

              : gym.admin_approval_status === "pending"

              ? "bg-yellow-100 text-yellow-700"

              : "bg-red-100 text-red-700"
          }

          `}
        >

          {gym.admin_approval_status}

        </span>

      </td>

      {/* Badges */}

      <td className="px-6 py-6">

        <div className="flex flex-col gap-2 items-center">

          {gym.is_verified == 1 && (

            <span className="bg-purple-100 text-purple-700 rounded-full px-3 py-1 text-xs flex items-center gap-1">

              <BadgeCheck size={13} />

              Verified

            </span>

          )}

          {gym.is_zymgoo_trusted == 1 && (

            <span className="bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-xs flex items-center gap-1">

              <ShieldCheck size={13} />

              Trusted

            </span>

          )}

          {gym.is_top_search == 1 && (

            <span className="bg-orange-100 text-orange-700 rounded-full px-3 py-1 text-xs flex items-center gap-1">

              <TrendingUp size={13} />

              Top Search

            </span>

          )}

        </div>

      </td>

      {/* Status */}

      <td className="px-6 py-6 text-center">

        <span
          className={`px-4 py-2 rounded-full text-xs font-semibold

          ${
            gym.status == "1"
              ? "bg-green-100 text-green-700"

              : "bg-red-100 text-red-700"
          }

          `}
        >

          {gym.status == "1"

            ? "Active"

            : "Blocked"}

        </span>

      </td>

      {/* Created */}

      <td className="px-6 py-6">

        <div className="flex items-center justify-center gap-2 text-gray-600">

          <Calendar size={15} />

          <span className="text-sm">

            {formatDate(gym.created_at)}

          </span>

        </div>

      </td>

      {/* Actions */}

      <td className="px-6 py-6">

        <div className="flex items-center justify-center gap-2">

          <button className="h-10 w-10 rounded-xl bg-sky-100 hover:bg-sky-200 flex items-center justify-center transition">

            <Eye
              size={18}
              className="text-sky-700"
            />

          </button>

          <button className="h-10 w-10 rounded-xl bg-green-100 hover:bg-green-200 flex items-center justify-center transition">

            <Pencil
              size={18}
              className="text-green-700"
            />

          </button>

          <button className="h-10 w-10 rounded-xl bg-red-100 hover:bg-red-200 flex items-center justify-center transition">

            <Trash2
              size={18}
              className="text-red-700"
            />

          </button>

        </div>

      </td>

    </tr>
  );
}