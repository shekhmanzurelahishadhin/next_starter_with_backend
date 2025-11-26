// Role Detail Component for View Modal
import Badge from "@/components/ui/badge/Badge";

interface Role {
  id: number | string;
  name: string;
  guard_name: string;
  created_at: string | null;
  updated_at: string | null;
}

const RoleDetailView = ({ role }: { role: Role }) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    const [datePart, timePart] = dateString.split(" ");
    const [y, m, d] = datePart.split("-");
    const [hour, minute] = timePart ? timePart.split(":") : ["00", "00"];
    return `${d}-${m}-${y} ${hour}:${minute}`;
  };

  return (
    <div className="space-y-4">
      <div className="overflow-hidden border rounded-lg border-gray-200 dark:border-gray-700">
        <table className="w-full">
          <tbody>
            {/* Role Name */}
            <tr className="border-b border-gray-100 dark:border-gray-600">
              <td className="px-4 py-3 font-medium text-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-gray-400 w-1/3">
                Role Name
              </td>
              <td className="px-4 py-3 font-semibold text-gray-800 dark:text-white/90">
                {role.name}
              </td>
            </tr>
            
            {/* Guard Name */}
            <tr className="border-b border-gray-100 dark:border-gray-600">
              <td className="px-4 py-3 font-medium text-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                Guard Name
              </td>
              <td className="px-4 py-3">
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
              </td>
            </tr>
            
            {/* Role ID */}
            <tr className="border-b border-gray-100 dark:border-gray-600">
              <td className="px-4 py-3 font-medium text-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                Role ID
              </td>
              <td className="px-4 py-3 font-mono text-sm text-gray-600 dark:text-gray-400">
                #{role.id}
              </td>
            </tr>
            
            {/* Created At */}
            <tr className="border-b border-gray-100 dark:border-gray-600">
              <td className="px-4 py-3 font-medium text-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                Created At
              </td>
              <td className="px-4 py-3 text-gray-800 dark:text-white/90">
                {formatDate(role.created_at)}
              </td>
            </tr>
            
            {/* Updated At */}
            <tr className="border-b border-gray-100 dark:border-gray-600">
              <td className="px-4 py-3 font-medium text-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                Updated At
              </td>
              <td className="px-4 py-3 text-gray-800 dark:text-white/90">
                {formatDate(role.updated_at)}
              </td>
            </tr>
            
            {/* Status */}
            <tr>
              <td className="px-4 py-3 font-medium text-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                Status
              </td>
              <td className="px-4 py-3">
                <Badge
                  size="sm"
                  color="success"
                  variant="light"
                >
                  Active
                </Badge>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoleDetailView;