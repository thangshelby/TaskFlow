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
    <section className="flex-1 rounded-xl border border-[#e8e8e7] bg-white shadow-sm transition-all duration-300 hover:shadow-md">
      {/* Header */}
      <div className="border-b border-[#e8e8e7]/60 p-5 px-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#064e3b]">{title}</h3>
            <p className="mt-1 text-xs font-medium text-[#404944] opacity-70">
              {description}
              {linkText && (
                <Link
                  to={href}
                  className="ml-1 font-semibold text-[#064e3b] hover:underline"
                >
                  {linkText}
                </Link>
              )}
            </p>
          </div>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
};

export default SectionContainer;

