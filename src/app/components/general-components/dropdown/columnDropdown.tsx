import { Dropdown, type MenuProps } from "antd";
import { useState, useEffect, memo, useMemo } from "react";
import { useRowPermission } from "@libs/app/context/permission.context";
import { Tooltip } from "antd/lib";

const ColumnDropdown = memo(
  ({
    isOpen,
    setIsOpenDropdown,
    items,
    currentItem,
    children,
    disabled,
    isLoading,
  }: {
    isOpen?: boolean;
    setIsOpenDropdown?: (isOpen: boolean) => void;
    items?: MenuProps["items"];
    currentItem?: string;
    children: React.ReactNode;
    disabled?: boolean;
    isLoading?: boolean;
  }) => {
    const [searchText, setSearchText] = useState("");
    const [visible, setVisible] = useState(isOpen || false);

    // Filter the items
    const filteredItems = useMemo(() => {
      if (searchText.length == 0) {
        return items;
      }
      const filteredItems = items?.filter((item) => {
        if (
          !item ||
          typeof item !== "object" ||
          !("value" in item) ||
          typeof item.value !== "string"
        ) {
          return false;
        }
        return item.value.toLowerCase().includes(searchText.toLowerCase());
      });
      return filteredItems;
    }, [searchText, items]);

    // Get the height of the element
    const [elementHeight, setElementHeight] = useState(0);
    useEffect(() => {
      const container = document.getElementsByClassName("ant-table-thead");
      if (container.length > 0) {
        setElementHeight(container[0].clientHeight);
      }
    }, []);

    let permissionResult;
    try {
      permissionResult = useRowPermission();
    } catch (error) {
      // Fallback if PermissionContext is not available
      permissionResult = {
        isAllow: true,
        message: "",
      };
    }

    return (
      <Tooltip
        placement="top"
        trigger={["click", "hover"]}
        title={permissionResult.isAllow ? "" : permissionResult.message}
      >
        <div
          style={{
            blockSize: elementHeight || 39,
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
          className={`flex items-center ${!permissionResult.isAllow || disabled ? "cursor-not-allowed" : ""}`}
        >
          <Dropdown
            disabled={!permissionResult.isAllow || disabled}
            menu={{
              style: {
                padding: "4px 0px",
                borderRadius: "0px",
              },
              items: isLoading ? loadingMenuItems : filteredItems,
            }}
            trigger={["click"]}
            onOpenChange={(open) => {
              setVisible(open);
              if (setIsOpenDropdown) {
                setIsOpenDropdown(open);
              }
            }}
            open={visible}
          >
            {visible ? (
              <div className="p-1">
                <input
                  placeholder={currentItem}
                  value={searchText}
                  autoFocus={true}
                  onChange={(e) => setSearchText(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="h-full w-full rounded-none border-2 border-emerald-500 p-1 text-xs text-gray-800 outline-none"
                />
              </div>
            ) : (
              <div className="py-2">{children}</div>
            )}
          </Dropdown>
        </div>
      </Tooltip>
    );
  },
);

export default ColumnDropdown;
const loadingMenuItems: MenuProps["items"] = [
  {
    key: "loading",
    label: (
      <div className="flex items-center justify-center px-4 py-2 text-xs text-gray-500">
        <span className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent"></span>
        Loading...
      </div>
    ),
    disabled: true,
  },
];
