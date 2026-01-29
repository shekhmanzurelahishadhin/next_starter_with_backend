"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import {
  BoxCubeIcon,
  CalenderIcon,
  ChevronDownIcon,
  FiSettings,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
  UserCircleIcon,
  FiUser,
  FiShoppingCart,
  FiShoppingBag,
} from "../icons/index";
import { useAuth } from "@/context/AuthContext";

// Types
type SubSubItem = {
  name: string;
  path: string;
  new?: boolean;
  requiredRoles?: string[];
  requiredPermissions?: string[];
};

type SubItem = {
  name: string;
  path?: string;
  new?: boolean;
  subSubItems?: SubSubItem[];
  requiredRoles?: string[];
  requiredPermissions?: string[];
};

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: SubItem[];
  requiredRoles?: string[];
  requiredPermissions?: string[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    requiredPermissions: ["dashboard.view", "role.edit"],
    subItems: [
      {
        name: "Ecommerce",
        path: "/ecommerce",
        subSubItems: [
          {
            name: "Analytics",
            path: "/ecommerce/analytics",
            requiredPermissions: ["role.vieww"],
          },
          // { name: "Sales", path: "/ecommerce/sales", new: true },
          { name: "Products", path: "/ecommerce/products" },
        ]
      },
    ],
  },
  {
    icon: <FiUser />,
    name: "User Roles",
    subItems: [
      { name: "Roles", path: "/authorization/roles", requiredPermissions: ["role.view", "role.create", "role.edit", "role.delete"] },
      { name: "Permissions", path: "/authorization/permissions", requiredPermissions: ["permission.view", "permission.create", "permission.edit", "permission.delete"] },
      { name: "Users", path: "/users", requiredPermissions: ["user.view", "user.create", "user.edit", "user.delete"] },
    ],
  },
  {
    icon: <FiSettings />,
    name: "Soft Configure",
    subItems: [
      { name: "Company", path: "/configure/companies", requiredPermissions: ["company.view", "company.create", "company.edit", "company.delete"] },
      { name: "Category", path: "/configure/categories", requiredPermissions: ["category.view", "category.create", "category.edit", "category.delete"] },
      { name: "Sub-Category", path: "/configure/sub-categories", requiredPermissions: ["sub-category.view", "sub-category.create", "sub-category.edit", "sub-category.delete"] },
      { name: "Units", path: "/configure/units", requiredPermissions: ["unit.view", "unit.create", "unit.edit", "unit.delete"] },
      { name: "Brands", path: "/configure/brands", requiredPermissions: ["brand.view", "brand.create", "brand.edit", "brand.delete"] },
      { name: "Lookups", path: "/configure/lookups", requiredPermissions: ["lookup.view", "lookup.create", "lookup.edit", "lookup.delete"] },
    ],
  },
  {
    name: "Purchases",
    icon: <FiShoppingCart />,
    subItems: [
      { name: "Supplier", path: "/purchases/suppliers", requiredPermissions: ["supplier.view", "supplier.create", "supplier.edit", "supplier.delete"] },
    ],
  },
  {
    name: "Sales",
    icon: <FiShoppingBag />,
    subItems: [
      { name: "Customers", path: "/sales/customers", requiredPermissions: ["customer.view", "customer.create", "customer.edit", "customer.delete"] },
    ],
  },
  {
    icon: <CalenderIcon />,
    name: "Calendar",
    path: "/calendar",
  },
  {
    icon: <UserCircleIcon />,
    name: "User Profile",
    path: "/profile",
  },
  {
    name: "Forms",
    icon: <ListIcon />,
    subItems: [
      {
        name: "Form Elements",
        path: "/form-elements",
      },
      {
        name: "Form Layouts",
        path: "/form-layouts",
      },
    ],
  },
  {
    name: "Tables",
    icon: <TableIcon />,
    subItems: [
      {
        name: "Basic Tables",
        path: "#",
        subSubItems: [
          { name: "Basic Table", path: "/basic-tables" },
          { name: "Data Table", path: "/data-tables" },
        ]
      },
    ],
  },
  {
    name: "Pages",
    icon: <PageIcon />,
    subItems: [
      { name: "Blank Page", path: "/blank" },
      { name: "404 Error", path: "/error-404" },
    ],
  },
];

const othersItems: NavItem[] = [
  {
    icon: <PieChartIcon />,
    name: "Charts",
    subItems: [
      {
        name: "Line Chart",
        path: "/line-chart",
        subSubItems: [
          { name: "Basic", path: "/line-chart/basic" },
          { name: "Advanced", path: "/line-chart/advanced" },
        ]
      },
    ],
  },
  {
    icon: <BoxCubeIcon />,
    name: "UI Elements",
    subItems: [
      {
        name: "Alerts",
        path: "/alerts",
        subSubItems: [
          { name: "Basic", path: "/alerts/basic" },
          { name: "Dismissible", path: "/alerts/dismissible" },
        ]
      },
      { name: "Avatar", path: "/avatars" },
      { name: "Modals", path: "/modals" },
    ],
  },
  {
    icon: <PlugInIcon />,
    name: "Authentication",
    subItems: [
      { name: "Sign In", path: "/signin" },
      { name: "Sign Up", path: "/signup" },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const { loading, hasRole, hasPermission } = useAuth();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);

  const [openSubSubmenu, setOpenSubSubmenu] = useState<{
    type: "main" | "others";
    parentIndex: number;
    subIndex: number;
  } | null>(null);

  // DYNAMIC isActive function that handles all parent-child relationships
  const isActive = useCallback((menuPath?: string): boolean => {
    if (!menuPath || menuPath === "#") return false;
    
    // Exact match
    if (pathname === menuPath) return true;
    
    // If menuPath is a parent route, check if current path starts with it
    if (pathname.startsWith(menuPath + "/")) {
      return true;
    }
    
    // Special handling for root paths that are not exact matches
    if (menuPath === "/") {
      return pathname === "/" || pathname.startsWith("/categories") || pathname.startsWith("/line-chart");
    }
    
    return false;
  }, [pathname]);

  // Helper function to check if user has access to menu item
  const hasAccess = useCallback((item: {
    requiredRoles?: string[];
    requiredPermissions?: string[];
  }) => {
    // If no restrictions, allow access
    if (!item.requiredRoles && !item.requiredPermissions) {
      return true;
    }

    // Check roles
    if (item.requiredRoles && item.requiredRoles.length > 0) {
      const hasRequiredRole = item.requiredRoles.some(role => hasRole(role));
      if (!hasRequiredRole) return false;
    }

    // Check permissions
    if (item.requiredPermissions && item.requiredPermissions.length > 0) {
      const hasRequiredPermission = item.requiredPermissions.some(permission =>
        hasPermission(permission)
      );
      if (!hasRequiredPermission) return false;
    }

    return true;
  }, [hasRole, hasPermission]);

  // Fixed recursive filtering function
  const filterNavItemsRecursive = useCallback((items: NavItem[]): NavItem[] => {
    return items
      .map(item => {
        // Check if item itself has access
        if (!hasAccess(item)) {
          return null;
        }

        let filteredSubItems: SubItem[] = [];

        // Process subItems if they exist
        if (item.subItems) {
          filteredSubItems = item.subItems
            .map(subItem => {
              // Check if subItem itself has access
              if (!hasAccess(subItem)) {
                return null;
              }

              let filteredSubSubItems: SubSubItem[] = [];

              // Process subSubItems if they exist
              if (subItem.subSubItems) {
                filteredSubSubItems = subItem.subSubItems.filter(
                  subSubItem => hasAccess(subSubItem)
                );
              }

              // FIXED LOGIC: Keep subItem only if:
              // 1. It has its own path AND no subSubItems (direct link), OR
              // 2. It has visible subSubItems (has children to show)
              const shouldKeepSubItem =
                (subItem.path && (!subItem.subSubItems || subItem.subSubItems.length === 0)) || // Direct link with no children
                (filteredSubSubItems.length > 0); // Has visible children

              if (shouldKeepSubItem) {
                return {
                  ...subItem,
                  ...(subItem.subSubItems && { subSubItems: filteredSubSubItems })
                };
              }

              // Otherwise, filter out this subItem
              return null;
            })
            .filter(Boolean) as SubItem[];
        }

        // Keep item if:
        // 1. It has its own path, OR
        // 2. It has visible subItems
        const shouldKeepItem = item.path || filteredSubItems.length > 0;

        return shouldKeepItem ? {
          ...item,
          ...(item.subItems && { subItems: filteredSubItems })
        } : null;
      })
      .filter(Boolean) as NavItem[];
  }, [hasAccess]);

  // Filtered navigation items
  const filteredNavItems = useMemo(() => filterNavItemsRecursive(navItems), [filterNavItemsRecursive]);
  const filteredOthersItems = useMemo(() => filterNavItemsRecursive(othersItems), [filterNavItemsRecursive]);

  // DYNAMIC function to find active menu item in the hierarchy
  const findActiveMenuPath = useCallback((): { 
    type: "main" | "others"; 
    parentIndex: number; 
    subIndex?: number; 
    subSubIndex?: number 
  } | null => {
    let result: { type: "main" | "others"; parentIndex: number; subIndex?: number; subSubIndex?: number } | null = null;

    // Check all menu items
    const checkItems = (items: NavItem[], type: "main" | "others") => {
      for (let parentIndex = 0; parentIndex < items.length; parentIndex++) {
        const item = items[parentIndex];
        
        // Check main item
        if (item.path && isActive(item.path)) {
          return { type, parentIndex };
        }

        // Check subItems
        if (item.subItems) {
          for (let subIndex = 0; subIndex < item.subItems.length; subIndex++) {
            const subItem = item.subItems[subIndex];
            
            if (subItem.path && isActive(subItem.path)) {
              return { type, parentIndex, subIndex };
            }

            // Check subSubItems
            if (subItem.subSubItems) {
              for (let subSubIndex = 0; subSubIndex < subItem.subSubItems.length; subSubIndex++) {
                const subSubItem = subItem.subSubItems[subSubIndex];
                
                if (isActive(subSubItem.path)) {
                  return { type, parentIndex, subIndex, subSubIndex };
                }
              }
            }
          }
        }
      }
      return null;
    };

    // Check main nav items first
    result = checkItems(filteredNavItems, "main");
    
    // If not found in main, check others
    if (!result) {
      result = checkItems(filteredOthersItems, "others");
    }

    return result;
  }, [filteredNavItems, filteredOthersItems, isActive]);

  // Set initial active menu based on current path
  useEffect(() => {
    if (loading) return; // Wait for auth to load

    const activeMenu = findActiveMenuPath();

    if (activeMenu) {
      setOpenSubmenu({
        type: activeMenu.type,
        index: activeMenu.parentIndex,
      });

      if (activeMenu.subIndex !== undefined) {
        setOpenSubSubmenu({
          type: activeMenu.type,
          parentIndex: activeMenu.parentIndex,
          subIndex: activeMenu.subIndex,
        });
      } else {
        setOpenSubSubmenu(null);
      }
    } else {
      setOpenSubmenu(null);
      setOpenSubSubmenu(null);
    }
  }, [pathname, loading, findActiveMenuPath]);

  // Handlers for submenu toggles
  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
    setOpenSubSubmenu(null);
  };

  // Handler for sub-submenu toggles
  const handleSubSubmenuToggle = (
    parentIndex: number,
    subIndex: number,
    menuType: "main" | "others"
  ) => {
    setOpenSubSubmenu((prevOpenSubSubmenu) => {
      if (
        prevOpenSubSubmenu &&
        prevOpenSubSubmenu.type === menuType &&
        prevOpenSubSubmenu.parentIndex === parentIndex &&
        prevOpenSubSubmenu.subIndex === subIndex
      ) {
        return null;
      }
      return { type: menuType, parentIndex, subIndex };
    });
  };

  // Render menu items
  const renderMenuItems = (
    navItems: NavItem[],
    menuType: "main" | "others"
  ) => (
    <ul className="flex flex-col gap-4">
      {navItems.map((nav, index) => {
        const isMainItemActive = nav.path ? isActive(nav.path) : false;
        const isSubmenuOpen = openSubmenu?.type === menuType && openSubmenu?.index === index;
        
        return (
          <li key={nav.name}>
            {nav.subItems ? (
              <button
                onClick={() => handleSubmenuToggle(index, menuType)}
                className={`menu-item group  ${isSubmenuOpen
                    ? "menu-item-active"
                    : "menu-item-inactive"
                  } cursor-pointer ${!isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "lg:justify-start"
                  }`}
              >
                <span
                  className={` ${isSubmenuOpen
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                    }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className={`menu-item-text`}>{nav.name}</span>
                )}
                {(isExpanded || isHovered || isMobileOpen) && (
                  <ChevronDownIcon
                    className={`ml-auto w-5 h-5 transition-transform duration-200  ${isSubmenuOpen
                        ? "rotate-180 text-brand-500"
                        : ""
                      }`}
                  />
                )}
              </button>
            ) : (
              nav.path && (
                <Link
                  href={nav.path}
                  className={`menu-item group ${isMainItemActive ? "menu-item-active" : "menu-item-inactive"
                    }`}
                >
                  <span
                    className={`${isMainItemActive
                        ? "menu-item-icon-active"
                        : "menu-item-icon-inactive"
                      }`}
                  >
                    {nav.icon}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className={`menu-item-text`}>{nav.name}</span>
                  )}
                </Link>
              )
            )}
            {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
              <div
                className="overflow-hidden transition-all duration-300"
                style={{
                  height: isSubmenuOpen ? 'auto' : '0px',
                  opacity: isSubmenuOpen ? 1 : 0,
                }}
              >
                <ul className="mt-2 space-y-1 ml-9">
                  {nav.subItems.map((subItem, subIndex) => {
                    const isSubItemActive = subItem.path ? isActive(subItem.path) : false;
                    const isSubSubmenuOpen = openSubSubmenu?.type === menuType &&
                      openSubSubmenu?.parentIndex === index &&
                      openSubSubmenu?.subIndex === subIndex;
                    
                    return (
                      <li key={subItem.name}>
                        {subItem.subSubItems && subItem.subSubItems.length > 0 ? (
                          <>
                            <button
                              onClick={() => handleSubSubmenuToggle(index, subIndex, menuType)}
                              className={`menu-dropdown-item w-full text-left cursor-pointer ${isSubSubmenuOpen
                                  ? "menu-dropdown-item-active"
                                  : "menu-dropdown-item-inactive"
                                }`}
                            >
                              {subItem.name}
                              <span className="flex items-center gap-1 ml-auto">
                                {subItem.new && (
                                  <span
                                    className={`ml-auto ${isSubSubmenuOpen
                                        ? "menu-dropdown-badge-active"
                                        : "menu-dropdown-badge-inactive"
                                      } menu-dropdown-badge `}
                                  >
                                    new
                                  </span>
                                )}
                                <ChevronDownIcon
                                  className={`w-4 h-4 transition-transform duration-200  ${isSubSubmenuOpen
                                      ? "rotate-180 text-brand-500"
                                      : ""
                                    }`}
                                />
                              </span>
                            </button>

                            {/* Third Layer Menu */}
                            <div
                              className="overflow-hidden transition-all duration-300"
                              style={{
                                height: isSubSubmenuOpen ? 'auto' : '0px',
                                opacity: isSubSubmenuOpen ? 1 : 0,
                              }}
                            >
                              <ul className="mt-2 space-y-1 ml-6">
                                {subItem.subSubItems.map((subSubItem) => (
                                  <li key={subSubItem.name}>
                                    <Link
                                      href={subSubItem.path}
                                      className={`menu-dropdown-item pl-4 ${isActive(subSubItem.path)
                                          ? "menu-dropdown-item-active"
                                          : "menu-dropdown-item-inactive"
                                        }`}
                                    >
                                      {subSubItem.name}
                                      <span className="flex items-center gap-1 ml-auto">
                                        {subSubItem.new && (
                                          <span
                                            className={`ml-auto ${isActive(subSubItem.path)
                                                ? "menu-dropdown-badge-active"
                                                : "menu-dropdown-badge-inactive"
                                              } menu-dropdown-badge `}
                                          >
                                            new
                                          </span>
                                        )}
                                      </span>
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </>
                        ) : (
                          <Link
                            href={subItem.path!}
                            className={`menu-dropdown-item ${isSubItemActive
                                ? "menu-dropdown-item-active"
                                : "menu-dropdown-item-inactive"
                              }`}
                          >
                            {subItem.name}
                            <span className="flex items-center gap-1 ml-auto">
                              {subItem.new && (
                                <span
                                  className={`ml-auto ${isSubItemActive
                                      ? "menu-dropdown-badge-active"
                                      : "menu-dropdown-badge-inactive"
                                    } menu-dropdown-badge `}
                                >
                                  new
                                </span>
                              )}
                            </span>
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );

  // Show loading state while checking permissions
  if (loading) {
    return (
      <aside className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center">Loading...</div>
        </div>
      </aside>
    );
  }

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen
          ? "w-[290px]"
          : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex  ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
          }`}
      >
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <Image
                className="dark:hidden"
                src="/images/logo/logo.svg"
                alt="Logo"
                width={150}
                height={40}
              />
              <Image
                className="hidden dark:block"
                src="/images/logo/logo-dark.svg"
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <Image
              src="/images/logo/logo-icon.svg"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {filteredNavItems.length > 0 ? (
                renderMenuItems(filteredNavItems, "main")
              ) : (
                <p className="text-sm text-gray-500 text-center py-2">No menu items available</p>
              )}
            </div>

            <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Others"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {filteredOthersItems.length > 0 ? (
                renderMenuItems(filteredOthersItems, "others")
              ) : (
                <p className="text-sm text-gray-500 text-center py-2">No other items available</p>
              )}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;