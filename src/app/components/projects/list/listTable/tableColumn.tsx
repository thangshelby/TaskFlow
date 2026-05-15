import { columnsIcon } from "@libs/constants/list";
import { IIssue } from "@libs/types/issue";
import { type TableColumnType } from "antd";
import { get } from "lodash";
import React from "react";
import { FaPlus } from "react-icons/fa";
import { ITableColumn } from "@libs/constants/list";

const fixedField = ["title", "type"];
  
const TableColumn = (
  key: string,
  title: string,
  render: (value: string, record: IIssue) => React.ReactNode,
  width?: number,
): TableColumnType<IIssue> => {
  return {
    title: (
      <div
        id={key}
        className="group item flex items-center justify-between gap-2 font-manrope"
      >
        <div className="flex items-center gap-2">
          <div className="rounded-md p-1 opacity-50 group-hover:opacity-100 transition-opacity">
            {key in columnsIcon ? (
              columnsIcon[key as ITableColumn]
            ) : (
              <FaPlus size={12} className="text-[#064e3b]" /> 
            )}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#404944]">{title}</span>
        </div>
      </div>
    ),
    dataIndex: key,
    key,
    fixed: fixedField.includes(key),
    render,
    width: width ? width : 150,
    sorter: {
      compare: (a: IIssue, b: IIssue) => {
        const aValue = get(a, key);
        const bValue = get(b, key);
        if (typeof aValue === "number" && typeof bValue === "number") {
          return aValue - bValue;
        } else if (typeof aValue === "string" && typeof bValue === "string") {
          return aValue.localeCompare(bValue);
        }
        return 0;
      },
    },
  };
};

export default TableColumn;
