import { Link, useLocation } from "react-router-dom";

export function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(Boolean);

  // Map route segments to readable names
  const nameMap: Record<string, string> = {
    operations: "Operations Dashboard",
    "partners-management": "Partners Management",
    "partners": "Partners",
    "drivers": "Drivers",
    "users": "Users",
    "analytics": "Analytics",
    "issues": "Issues",
    "regions": "Regions",
    // Add more as needed
  };

  // Remove 'admin' from the breadcrumb trail
  const filteredPathnames = pathnames.filter(segment => segment !== 'admin');

  return (
    <nav className="mb-4 text-sm" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <Link to="/operations" className="text-blue-600 hover:underline font-semibold">Operations</Link>
        </li>
        {filteredPathnames.map((segment, idx) => {
          const to = "/" + filteredPathnames.slice(0, idx + 1).join("/");
          return (
            <li key={to} className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              {idx === filteredPathnames.length - 1 ? (
                <span className="text-gray-700 font-semibold">{nameMap[segment] || segment}</span>
              ) : (
                <Link to={to} className="text-blue-600 hover:underline">{nameMap[segment] || segment}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
