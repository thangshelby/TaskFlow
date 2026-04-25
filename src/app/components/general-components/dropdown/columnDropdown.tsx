import { Dropdown, type MenuProps } from "antd";
import { useState, useEffect, useRef, memo, useMemo } from "react";
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

    const inputRef = useRef<HTMLInputElement>(null);
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

    useEffect(() => {
      if (visible) {
        // Small delay to ensure input is mounted by AntD dropdownRender
        const timer = setTimeout(() => {
          inputRef.current?.focus();
        }, 10);
        return () => clearTimeout(timer);
      } else {
        setSearchText("");
      }
    }, [visible]);


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
          className={`flex items-center overflow-hidden ${!permissionResult.isAllow || disabled ? "cursor-not-allowed" : ""}`}
        >
          <Dropdown
            disabled={!permissionResult.isAllow || disabled}
            dropdownRender={(menu) => (
              <div className="bg-white rounded-lg shadow-2xl border border-[#e8e8e7] overflow-hidden min-w-[220px] font-manrope animate-in fade-in zoom-in duration-200">
                <div className="bg-[#f9f9f8] p-2 border-b border-[#e8e8e7]">
                  <div className="relative">
                    <input
                      ref={inputRef}
                      placeholder={`Search ${currentItem || "..."}`}
                      value={searchText}
                      autoFocus={true}
                      onChange={(e) => setSearchText(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full rounded-md border border-[#e8e8e7] pl-8 pr-2 py-1.5 text-[11px] font-bold text-[#064e3b] outline-none focus:border-[#064e3b]/30 focus:ring-1 focus:ring-[#064e3b]/10 bg-white placeholder:text-[#404944]/40 transition-all shadow-sm"
                    />
                    <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#404944]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                  {menu}
                </div>
              </div>
            )}
            menu={{
              style: {
                borderRadius: "0", // Handled by container
                boxShadow: "none",
                border: "none",
                padding: "0px",
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
            <div className="py-2 transition-all duration-300 hover:opacity-100 opacity-90 cursor-pointer">
              {children}
            </div>
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
      <div className="flex items-center justify-center px-4 py-3 text-xs font-bold tracking-tight text-[#064e3b]/60 font-manrope">
        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-[#064e3b] border-t-transparent"></span>
        LOADING...
      </div>
    ),
    disabled: true,
  },
];

