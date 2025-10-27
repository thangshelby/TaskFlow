import { useDebounce } from "@libs/hooks/common/useDebounce";
import { useState, useRef } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { Popover } from "antd";
import ElasticSearch from "./elasticSearch";

export default function SearchHeader() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);
  const wrapperRef = useRef<HTMLDivElement>(null);
  return (
    <div className="relative" ref={wrapperRef}>
      <Popover
        content={<ElasticSearch searchQuery={debouncedSearch} />}
        trigger="click"
      >
        <div className="relative">
          <input
            type="text"
            placeholder="Search for issue..."
            className="w-full rounded-md border border-gray-300 px-4 py-2 outline-[#1447e6]"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
          />
          <FaMagnifyingGlass className="absolute top-3 right-3 h-4 w-4 text-gray-400" />
        </div>
      </Popover>
    </div>
  );
}
