import { Link } from "react-router-dom";

const SectionContainer = ({
  title,
  description,
  linkText,
  href = "#",
  children,
}: {
  title: string;
  description: string;
  linkText?: string;
  href?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex-1 rounded-lg border border-gray-200 bg-white shadow-sm">
      {/* Header with Jira-style styling */}

      <div className="border-b border-gray-200 bg-gray-50 p-2 px-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-md font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">
              {description}
              {linkText && (
                <Link
                  to={href}
                  className="ml-1 text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  {linkText}
                </Link>
              )}
            </p>
          </div>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
};

export default SectionContainer;
