"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/tables/DataTable";
import Badge from "@/components/ui/badge/Badge";
import Image from "next/image";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import AccessRoute from "@/routes/AccessRoute";
interface Order {
  id: number;
  user: {
    image: string;
    name: string;
    role: string;
  };
  projectName: string;
  team: {
    images: string[];
  };
  status: string;
  budget: string;
}

// Flatten the data for easier searching
interface FlattenedOrder extends Order {
  userName: string;
  userRole: string;
  userImage: string;
}

const tableData: Order[] = [
  {
    id: 1,
    user: {
      image: "/images/user/user-17.jpg",
      name: "Lindsey Curtis",
      role: "Web Designer",
    },
    projectName: "Agency Website",
    team: {
      images: [
        "/images/user/user-22.jpg",
        "/images/user/user-23.jpg",
        "/images/user/user-24.jpg",
      ],
    },
    budget: "3.9K",
    status: "Active",
  },
  {
    id: 2,
    user: {
      image: "/images/user/user-18.jpg",
      name: "Kaiya George",
      role: "Project Manager",
    },
    projectName: "Technology",
    team: {
      images: ["/images/user/user-25.jpg", "/images/user/user-26.jpg"],
    },
    budget: "24.9K",
    status: "Pending",
  },
  {
    id: 3,
    user: {
      image: "/images/user/user-17.jpg",
      name: "Zain Geidt",
      role: "Content Writing",
    },
    projectName: "Blog Writing",
    team: {
      images: ["/images/user/user-27.jpg"],
    },
    budget: "12.7K",
    status: "Active",
  },
  {
    id: 4,
    user: {
      image: "/images/user/user-20.jpg",
      name: "Abram Schleifer",
      role: "Digital Marketer",
    },
    projectName: "Social Media",
    team: {
      images: [
        "/images/user/user-28.jpg",
        "/images/user/user-29.jpg",
        "/images/user/user-30.jpg",
      ],
    },
    budget: "2.8K",
    status: "Cancel",
  },
  {
    id: 5,
    user: {
      image: "/images/user/user-21.jpg",
      name: "Carla George",
      role: "Front-end Developer",
    },
    projectName: "Website",
    team: {
      images: [
        "/images/user/user-31.jpg",
        "/images/user/user-32.jpg",
        "/images/user/user-33.jpg",
      ],
    },
    budget: "4.5K",
    status: "Active",
  },
];

// Flatten the data
const flattenedData: FlattenedOrder[] = tableData.map(order => ({
  ...order,
  userName: order.user.name,
  userRole: order.user.role,
  userImage: order.user.image,
}));

const columns: ColumnDef<FlattenedOrder>[] = [
  {
    accessorKey: "userName",
    header: "User",
    enableSorting: true,
    meta: {
      filterVariant: "text", // Text input filter
    },
    cell: ({ row }) => {
      const user = row.original.user;
      return (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 overflow-hidden rounded-full">
            <Image
              width={40}
              height={40}
              src={user.image}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
              {user.name}
            </span>
            <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
              {user.role}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "projectName",
    header: "Project Name",
    enableSorting: true,
    meta: {
      filterVariant: "select", // Select dropdown filter
    },
    cell: ({ row }) => {
      return (
        <span className="text-gray-800 dark:text-white/90">
          {row.getValue("projectName")}
        </span>
      );
    },
  },
  {
    accessorKey: "userRole",
    header: "Role",
    enableSorting: true,
    meta: {
      filterVariant: "text", // Select dropdown filter
    },
    cell: ({ row }) => {
      return (
        <span className="text-gray-600 dark:text-gray-400">
          {row.getValue("userRole")}
        </span>
      );
    },
  },
  {
    accessorKey: "team",
    header: "Team",
    enableSorting: false,
    // No meta.filterVariant - this column won't have a filter
    meta: {
      filterVariant: "none", // No filter
    },
    cell: ({ row }) => {
      const team = row.original.team;
      return (
        <div className="flex -space-x-2">
          {team.images.map((teamImage, index) => (
            <div
              key={index} // Use index as key since images might not be unique
              className="w-6 h-6 overflow-hidden border-2 border-white rounded-full dark:border-gray-900"
            >
              <Image
                width={24}
                height={24}
                src={teamImage}
                alt={`Team member ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: true,
    meta: {
      filterVariant: "select", // Select dropdown filter
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          size="sm"
          color={
            status === "Active"
              ? "success"
              : status === "Pending"
                ? "warning"
                : "error"
          }
          variant="light"
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "budget",
    header: "Budget",
    enableSorting: true,
    meta: {
      filterVariant: "text", // Text input filter
    },
    cell: ({ row }) => {
      return (
        <span className="font-medium text-gray-800 dark:text-white/90">
          {row.getValue("budget")}
        </span>
      );
    },
  },
];

export default function TablesPage() {
  const { isOpen, openModal, closeModal } = useModal();
  const handleSave = () => {
    // Handle save logic here
    console.log("Saving changes...");
    closeModal();
  };

  return (
    <AccessRoute requiredPermissions={["view_data_tables"]}>
    <div>
      <PageBreadcrumb pageTitle="Data Table with Column Filters" />
      <div className="space-y-6">
        <ComponentCard
          title="Advanced Data Table with Column Filters"
          desc="Advance Data Table with Column Filters"
          showAddButton={true} // Show the "Add New" button
          buttonLabel="Add New"
          openModal={openModal} // Function to open the modal
        >
          <DataTable
            columns={columns}
            data={flattenedData}
            searchKey="userName"
          />
        </ComponentCard>
        <Modal
          isOpen={isOpen}
          onClose={closeModal} // Function to close the modal
          className="max-w-[584px] p-5 lg:p-10"
        >
          <form className="">
            <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
              Personal Information
            </h4>

            <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
              <div className="col-span-1">
                <Label>First Name</Label>
                <Input type="text" placeholder="Emirhan" />
              </div>

              <div className="col-span-1">
                <Label>Last Name</Label>
                <Input type="text" placeholder="Boruch" />
              </div>

              <div className="col-span-1">
                <Label>Last Name</Label>
                <Input type="email" placeholder="emirhanboruch55@gmail.com" />
              </div>

              <div className="col-span-1">
                <Label>Phone</Label>
                <Input type="text" placeholder="+09 363 398 46" />
              </div>

              <div className="col-span-1 sm:col-span-2">
                <Label>Bio</Label>
                <Input type="text" placeholder="Team Manager" />
              </div>
            </div>

            <div className="flex items-center justify-end w-full gap-3 mt-6">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
    </AccessRoute>
  );
}