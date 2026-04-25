import { useMemo } from "react";
import DatePicker from "antd/lib/date-picker";
import { useUpdateIssue } from "@libs/hooks/apis/useIssue";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { TriangleAlert, Calendar } from "lucide-react";
import { useRowPermission } from "@libs/app/context/permission.context";
import { Tooltip } from "antd/lib";
import { useIssue } from "@libs/hooks/apis/useIssue";

dayjs.extend(utc);
dayjs.extend(customParseFormat);

type IssueDateField =
  | "created_at"
  | "updated_at"
  | "completed_at"
  | "due_date_from"
  | "due_date_to";

function normalizeLegacyDate(value: string): string {
  return value.replace("a.m.", "AM").replace("p.m.", "PM").trim();
}

function parseIssueDate(value?: string | null): Dayjs | null {
  if (!value) return null;

  if (value.startsWith("0001-01-01")) return null;

  if (value.includes("T") && value.endsWith("Z")) {
    return dayjs.utc(value);
  }

  const normalized = normalizeLegacyDate(value);
  const parsed = dayjs(normalized, "YYYY-MM-DD h:mm:ss A", true);
  return parsed.isValid() ? parsed : null;
}

const CustomDatePicker = ({
  issueId,
  projectId,
  field,
  isEditable = true,
  className,
}: {
  issueId: string;
  projectId: string;
  field: IssueDateField;
  isEditable?: boolean;
  className?: string;
}) => {
  const { updateIssue } = useUpdateIssue({ projectId });

  const { issue, isLoading } = useIssue(projectId, issueId);

  const isExpired = useMemo(() => {
    if (!issue) return;
    if (field !== "due_date_to" || !issue[field]) return false;
    return new Date(issue[field]!) < new Date();
  }, [issue, field]);

  const handleChange = (date: Dayjs | null) => {
    if (!issue) return;
    // nếu là created_at thì không update
    if (field === "created_at") return;
    updateIssue({
      id: issue.id,
      data: {
        [field]: date ? date.utc().toISOString() : "null",
      },
    });
  };

  const parsedDate = useMemo(() => {
    if (!issue) return null;
    return parseIssueDate(issue[field] || null);
  }, [issue, isEditable, field]);

  const permissionResult = useRowPermission();
  if (isLoading) return null;

  return (
    <div className={`font-manrope ${className}`}>
      <Tooltip title={permissionResult.isAllow ? "" : permissionResult.message}>
        <DatePicker
          placeholder="NONE"
          value={parsedDate}
          onChange={handleChange}
          disabled={field === "created_at" || !isEditable || !permissionResult.isAllow}
          format="YYYY-MM-DD"
          allowClear={isEditable && field !== "created_at"}
          variant="outlined"
          suffixIcon={
            isExpired ? (
              <TriangleAlert className="text-red-600" size={14} />
            ) : (
              <Calendar className="text-[#064e3b]/50 group-hover:text-[#064e3b]" size={14} />
            )
          }
          className={`w-full premium-datepicker ${isExpired ? "is-expired" : ""}`}
          style={{
            height: "32px",
            borderRadius: "6px",
            border: isExpired ? "1px solid #fee2e2" : "1px solid #e8e8e7",
            backgroundColor: isExpired ? "#fef2f2" : "white",
            padding: "4px 12px",
            fontSize: "11px",
            fontWeight: "700",
            fontFamily: "Manrope, sans-serif",
            color: isExpired ? "#dc2626" : "#064e3b",
          }}
        />
      </Tooltip>
    </div>
  );
};



export default CustomDatePicker;
