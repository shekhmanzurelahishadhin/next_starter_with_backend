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
  GridIcon,
  HorizontaLDots,
  ListIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
  UserCircleIcon,
  FiUser
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
    requiredPermissions: ["dashboard.view","role.edit"],
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
      { name: "Roles", path: "/authorization/roles" },
      { name: "Permissions", path: "/authorization/permissions" },
      { name: "Users", path: "/ecommerce/products" },
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
      { name: "Blank Page", path: "/blank"},
      { name: "404 Error", path: "/error-404"},
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
          { name: "Advanced", path: "/line-chart/advanced"},
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
      { name: "Avatar", path: "/avatars"},
      { name: "Modals", path: "/modals"},
    ],
  },
  {
    icon: <PlugInIcon />,
    name: "Authentication",
    subItems: [
      { name: "Sign In", path: "/signin"},
      { name: "Sign Up", path: "/signup"},
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

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

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

  // Debug: Log filtered items to see the result
  useEffect(() => {
    console.log('Filtered Nav Items:', filteredNavItems);
    console.log('Filtered Others Items:', filteredOthersItems);
  }, [filteredNavItems, filteredOthersItems]);

  // Find path in filtered items to get correct indexes
  const findPathInFilteredItems = useCallback((path: string) => {
    let result: { type: "main" | "others"; parentIndex: number; subIndex?: number; subSubIndex?: number } | null = null;

    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? filteredNavItems : filteredOthersItems;
      
      items.forEach((nav, parentIndex) => {
        // Check if this is a direct match
        if (nav.path === path) {
          result = { type: menuType as "main" | "others", parentIndex };
          return;
        }

        // Check subItems
        if (nav.subItems) {
          nav.subItems.forEach((subItem, subIndex) => {
            if (subItem.path === path) {
              result = { type: menuType as "main" | "others", parentIndex, subIndex };
              return;
            }

            // Check subSubItems
            if (subItem.subSubItems) {
              subItem.subSubItems.forEach((subSubItem, subSubIndex) => {
                if (subSubItem.path === path) {
                  result = { type: menuType as "main" | "others", parentIndex, subIndex, subSubIndex };
                  return;
                }
              });
            }
          });
        }
      });
    });

    return result;
  }, [filteredNavItems, filteredOthersItems]);

  // Set initial active menu based on current path - USING FILTERED ITEMS
  useEffect(() => {
    if (loading) return; // Wait for auth to load

    const pathMatch = findPathInFilteredItems(pathname);
    
    // Open the relevant menus based on the current path
    if (pathMatch) {
      setOpenSubmenu({
        type: pathMatch.type,
        index: pathMatch.parentIndex,
      }); // Open the main submenu

      if (pathMatch.subIndex !== undefined) {
        setOpenSubSubmenu({
          type: pathMatch.type,
          parentIndex: pathMatch.parentIndex,
          subIndex: pathMatch.subIndex,
        }); // Open the sub-submenu
      } else {
        setOpenSubSubmenu(null); // Close sub-submenu if not applicable
      }
    } else {
      setOpenSubmenu(null);
      setOpenSubSubmenu(null);
    }
  }, [pathname, loading, findPathInFilteredItems]);

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
      {navItems.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group  ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={` ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
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
                  className={`ml-auto w-5 h-5 transition-transform duration-200  ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
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
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`${
                    isActive(nav.path)
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
                height: openSubmenu?.type === menuType && openSubmenu?.index === index ? 'auto' : '0px',
                opacity: openSubmenu?.type === menuType && openSubmenu?.index === index ? 1 : 0,
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem, subIndex) => (
                  <li key={subItem.name}>
                    {subItem.subSubItems && subItem.subSubItems.length > 0 ? (
                      <>
                        <button
                          onClick={() => handleSubSubmenuToggle(index, subIndex, menuType)}
                          className={`menu-dropdown-item w-full text-left cursor-pointer ${
                            openSubSubmenu?.type === menuType &&
                            openSubSubmenu?.parentIndex === index &&
                            openSubSubmenu?.subIndex === subIndex
                              ? "menu-dropdown-item-active"
                              : "menu-dropdown-item-inactive"
                          }`}
                        >
                          {subItem.name}
                          <span className="flex items-center gap-1 ml-auto">
                            {subItem.new && (
                              <span
                                className={`ml-auto ${
                                  openSubSubmenu?.type === menuType &&
                                  openSubSubmenu?.parentIndex === index &&
                                  openSubSubmenu?.subIndex === subIndex
                                    ? "menu-dropdown-badge-active"
                                    : "menu-dropdown-badge-inactive"
                                } menu-dropdown-badge `}
                              >
                                new
                              </span>
                            )}
                            <ChevronDownIcon
                              className={`w-4 h-4 transition-transform duration-200  ${
                                openSubSubmenu?.type === menuType &&
                                openSubSubmenu?.parentIndex === index &&
                                openSubSubmenu?.subIndex === subIndex
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
                            height: openSubSubmenu?.type === menuType &&
                              openSubSubmenu?.parentIndex === index &&
                              openSubSubmenu?.subIndex === subIndex ? 'auto' : '0px',
                            opacity: openSubSubmenu?.type === menuType &&
                              openSubSubmenu?.parentIndex === index &&
                              openSubSubmenu?.subIndex === subIndex ? 1 : 0,
                          }}
                        >
                          <ul className="mt-2 space-y-1 ml-6">
                            {subItem.subSubItems.map((subSubItem) => (
                              <li key={subSubItem.name}>
                                <Link
                                  href={subSubItem.path}
                                  className={`menu-dropdown-item pl-4 ${
                                    isActive(subSubItem.path)
                                      ? "menu-dropdown-item-active"
                                      : "menu-dropdown-item-inactive"
                                  }`}
                                >
                                  {subSubItem.name}
                                  <span className="flex items-center gap-1 ml-auto">
                                    {subSubItem.new && (
                                      <span
                                        className={`ml-auto ${
                                          isActive(subSubItem.path)
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
                        className={`menu-dropdown-item ${
                          isActive(subItem.path!)
                            ? "menu-dropdown-item-active"
                            : "menu-dropdown-item-inactive"
                        }`}
                      >
                        {subItem.name}
                        <span className="flex items-center gap-1 ml-auto">
                          {subItem.new && (
                            <span
                              className={`ml-auto ${
                                isActive(subItem.path!)
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
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
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
        ${
          isExpanded || isMobileOpen
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
        className={`py-8 flex  ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
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
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
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
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
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