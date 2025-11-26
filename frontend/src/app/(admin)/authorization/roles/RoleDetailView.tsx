// Role Detail Component for View Modal
import { FiShield, FiCalendar, FiUser, FiClock } from "@/icons/index";
import Badge from "@/components/ui/badge/Badge";
const  RoleDetailView = ({ role }: { role: Role }) => {
    
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    const [datePart, timePart] = dateString.split(" ");
    const [y, m, d] = datePart.split("-");
    const [hour, minute] = timePart ? timePart.split(":") : ["00", "00"];
    return `${d}-${m}-${y} ${hour}:${minute}`;
  };

  return (
    <div className="space-y-6">
      {/* Role Basic Information */}
      <div className="p-4 border rounded-lg border-gray-200 dark:border-gray-700">
        <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
          <FiShield className="w-5 h-5 text-blue-500" />
          Role Information
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-600">
            <span className="font-medium text-gray-600 dark:text-gray-400">Role Name</span>
            <span className="font-semibold text-gray-800 dark:text-white/90">{role.name}</span>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-600">
            <span className="font-medium text-gray-600 dark:text-gray-400">Guard Name</span>
            <Badge
              size="sm"
              color={
                role.guard_name === "web"
                  ? "primary"
                  : role.guard_name === "api"
                    ? "success"
                    : "warning"
              }
              variant="light"
            >
              {role.guard_name}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-600">
            <span className="font-medium text-gray-600 dark:text-gray-400">Role ID</span>
            <span className="font-mono text-sm text-gray-600 dark:text-gray-400">#{role.id}</span>
          </div>
        </div>
      </div>

      {/* Timestamps */}
      <div className="p-4 border rounded-lg border-gray-200 dark:border-gray-700">
        <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
          <FiCalendar className="w-5 h-5 text-green-500" />
          Timestamps
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-600">
            <span className="flex items-center gap-2 font-medium text-gray-600 dark:text-gray-400">
              <FiCalendar className="w-4 h-4" />
              Created At
            </span>
            <span className="text-gray-800 dark:text-white/90">{formatDate(role.created_at)}</span>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-600">
            <span className="flex items-center gap-2 font-medium text-gray-600 dark:text-gray-400">
              <FiClock className="w-4 h-4" />
              Updated At
            </span>
            <span className="text-gray-800 dark:text-white/90">{formatDate(role.updated_at)}</span>
          </div>
        </div>
      </div>

      {/* Status Information */}
      <div className="p-4 border rounded-lg border-gray-200 dark:border-gray-700">
        <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
          <FiUser className="w-5 h-5 text-purple-500" />
          Status
        </h3>
        
        <div className="flex items-center justify-between py-2">
          <span className="font-medium text-gray-600 dark:text-gray-400">Active Status</span>
          <Badge
            size="sm"
            color="success"
            variant="light"
          >
            Active
          </Badge>
        </div>
      </div>
    </div>
  );
};
export default RoleDetailView;