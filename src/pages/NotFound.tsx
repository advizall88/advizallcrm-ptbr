
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  React.useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-md w-full shadow-neumorph p-8 bg-white rounded-lg">
        <h1 className="text-6xl font-bold text-primary mb-2">404</h1>
        <p className="text-2xl font-medium text-gray-700 mb-6">Page not found</p>
        <p className="text-gray-500 mb-8">
          The page you're looking for doesn't exist or you may not have permission to view it.
        </p>
        <div className="flex flex-col space-y-2">
          <Link to="/">
            <Button variant="default" className="w-full">
              Return to Dashboard
            </Button>
          </Link>
          <Link to="/prospects">
            <Button variant="outline" className="w-full">
              View Prospects
            </Button>
          </Link>
          <Link to="/clients">
            <Button variant="outline" className="w-full">
              View Clients
            </Button>
          </Link>
        </div>
      </div>
      <div className="mt-8 text-sm text-gray-400">
        Advizall CRM • Need help? Contact support@advizall.com
      </div>
    </div>
  );
};

export default NotFound;
