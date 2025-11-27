import Badge from "@/components/ui/badge/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
    <div className="space-y-4 py-4">
      <div className="overflow-hidden border rounded-lg border-gray-200 dark:border-gray-700">

        <Table>
          {/* Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">

            {/* Role Name */}
            <TableRow>
              <TableCell className="px-5 py-4 text-gray-600 font-medium bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                Role Name
              </TableCell>
              <TableCell className="px-5 py-4 text-gray-800 font-semibold dark:text-white/90">
                {role.name}
              </TableCell>
            </TableRow>

            {/* Guard Name */}
            <TableRow>
              <TableCell className="px-5 py-4 text-gray-600 font-medium bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                Guard Name
              </TableCell>
              <TableCell className="px-5 py-4">
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
              </TableCell>
            </TableRow>

            {/* Created At */}
            <TableRow>
              <TableCell className="px-5 py-4 text-gray-600 font-medium bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                Created At
              </TableCell>
              <TableCell className="px-5 py-4 text-gray-800 dark:text-white/90">
                {formatDate(role.created_at)}
              </TableCell>
            </TableRow>

            {/* Updated At */}
            <TableRow>
              <TableCell className="px-5 py-4 text-gray-600 font-medium bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                Updated At
              </TableCell>
              <TableCell className="px-5 py-4 text-gray-800 dark:text-white/90">
                {formatDate(role.updated_at)}
              </TableCell>
            </TableRow>

          </TableBody>

        </Table>

      </div>
    </div>
  );
};

export default RoleDetailView;
