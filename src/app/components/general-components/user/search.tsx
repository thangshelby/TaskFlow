import { useDebounce } from "@libs/hooks/common/useDebounce";
import { useState, useRef } from "react";
import { Search } from "lucide-react";
import { Popover } from "antd";
import ElasticSearch from "./elasticSearch";

export default function SearchHeader() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);
  const wrapperRef = useRef<HTMLDivElement>(null);
  return (
    <div className="relative w-full" ref={wrapperRef}>
      <Popover
        content={<ElasticSearch searchQuery={debouncedSearch} />}
        trigger="click"
        placement="bottomLeft"
      >
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search projects or tasks..."
            className="bg-[#eeeeed] border-none rounded-sm pl-10 pr-4 py-2 text-sm w-full focus:ring-2 focus:ring-[#064e3b]/20 transition-all outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </Popover>
    </div>
  );
}
