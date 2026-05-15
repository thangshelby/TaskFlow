import { useActivities } from "@libs/hooks/apis/useIssue";

export default function History({
  issueId,
  projectId,
}: {
  issueId?: string;
  projectId: string;
}) {
  const { activities } = useActivities({
    issue_id: issueId || "",
    project_id: projectId,
    page: 1,
    limit: 10,
  });

  if (!activities) return null;
  const getActivityIcon = (actionType: string) => {
    switch (actionType) {
      case "ISSUE_UPDATED":
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f0fdf4] text-[#064e3b] border border-[#064e3b]/10 shadow-sm">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </div>
        );
      case "COMMENT_ADDED":
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ecfdf5] text-[#059669] border border-[#059669]/10 shadow-sm">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.013 8.013 0 01-2.319-.34l-4.772 1.18a1 1 0 01-1.24-1.24l1.18-4.772A8 8 0 1121 12z"
              />
            </svg>
          </div>
        );
      default:
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f9f9f8] text-[#404944] border border-[#e8e8e7] shadow-sm">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        );
    }
  };

  const getFieldIcon = (field: string) => {
    switch (field.toLowerCase()) {
      case "status":
        return "🔄";
      case "assignee":
        return "👤";
      case "reporter":
        return "📝";
      case "priority":
        return "🔺";
      case "description":
        return "📄";
      case "labels":
        return "🏷️";
      case "component":
        return "🧩";
      default:
        return "✏️";
    }
  };

  const formatFieldLabel = (field: string) => {
    switch (field) {
      case "Description":
        return "updated description";
      case "Status":
        return "changed status";
      case "Reporter":
        return "changed reporter";
      case "Assignee":
        return "changed assignee";
      case "Priority":
        return "changed priority";
      default:
        return `changed ${field.toLowerCase()}`;
    }
  };

  // Extract plain text from ProseMirror/Tiptap JSON or return as-is
  const formatDisplayValue = (field: string, value: string | null | undefined): string => {
    if (!value) return "";
    if (field === "Description") {
      try {
        const doc = JSON.parse(value);
        const texts: string[] = [];
        const extract = (node: any) => {
          if (node.text) texts.push(node.text);
          if (node.content) node.content.forEach(extract);
        };
        extract(doc);
        const plain = texts.join(" ").trim();
        return plain.length > 60 ? plain.slice(0, 60) + "…" : plain || "(empty)";
      } catch {
        return value.length > 60 ? value.slice(0, 60) + "…" : value;
      }
    }
    return value;
  };

  const formatRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString();
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="max-h-full space-y-6 overflow-auto font-manrope">
      {activities?.map((activity, activityIndex) => (
        <div
          key={activity.id}
          className={`relative flex min-w-0 overflow-hidden space-x-4 ${activityIndex !== activities.length - 1 ? "pb-6" : ""
            }`}
        >
          {/* Timeline line */}
          {activityIndex !== activities.length - 1 && (
            <div className="absolute top-10 left-4 h-full w-0.5 bg-[#e8e8e7]" />
          )}

          {/* Activity icon */}
          <div className="relative shrink-0 z-10">
            {getActivityIcon(activity.action_type)}
          </div>

          {/* Activity content */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-3">
              {/* User avatar */}
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f9f9f8] border border-[#e8e8e7] text-[10px] font-bold text-[#064e3b]">
                {getUserInitials(activity.user_name)}
              </div>

              {/* User name and action */}
              <div className="flex items-center space-x-1.5 text-xs">
                <span className="font-bold text-[#064e3b]">
                  {activity.user_name}
                </span>
                <span className="text-[#404944] opacity-60">
                  {activity.action_type === "ISSUE_UPDATED"
                    ? "made changes"
                    : "performed action"}
                </span>
                <span className="text-[#e8e8e7]">•</span>
                <span className="text-[#404944] opacity-50 font-medium">
                  {formatRelativeTime(activity.created_at)}
                </span>
              </div>
            </div>

            {/* Changes */}
            {activity.changes && activity.changes.length > 0 && (
              <div className="mt-3 space-y-3">
                {activity.changes.map((change, index) => (
                  <div
                    key={index}
                    className="min-w-0 overflow-hidden rounded-xl border border-[#e8e8e7]/60 bg-[#f9f9f8]/30 px-4 py-3"
                  >
                    <div className="flex items-center space-x-2.5 text-xs">
                      <span className="shrink-0 text-sm">
                        {getFieldIcon(change.field)}
                      </span>
                      <span className="font-bold text-[#064e3b] uppercase tracking-wider text-[10px]">
                        {formatFieldLabel(change.field)}
                      </span>
                    </div>

                    <div className="mt-2.5 flex min-w-0 flex-wrap items-center gap-2 text-xs">
                      {change.old_value && (
                        <>
                          <div
                            className="inline-flex max-w-[160px] shrink-0 items-center overflow-hidden rounded-md bg-[#fef2f2] px-2 py-0.5 font-bold text-[#991b1b] line-through decoration-[#991b1b]/30"
                            title={change.old_value}
                          >
                            <span className="block truncate">
                              {formatDisplayValue(change.field, change.old_value)}
                            </span>
                          </div>
                          <svg
                            className="h-3 w-3 shrink-0 text-[#064e3b] opacity-20"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </svg>
                        </>
                      )}
                      <div
                        className="inline-flex max-w-[160px] shrink-0 items-center overflow-hidden rounded-md bg-[#f0fdf4] px-2 py-0.5 font-bold text-[#064e3b]"
                        title={change.new_value ?? ""}
                      >
                        <span className="block truncate">
                          {formatDisplayValue(change.field, change.new_value)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}

      {(!activities || activities.length === 0) && (
        <div className="py-12 text-center text-xs font-medium text-[#404944] opacity-40 italic">
          No activity recorded yet.
        </div>
      )}
    </div>
  );
}

