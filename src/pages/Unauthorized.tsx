import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Unauthorized = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="flex h-screen flex-col items-center justify-center p-4 text-center">
      <div className="mb-4 text-6xl">🔒</div>
      <h1 className="mb-2 text-3xl font-bold">Access Denied</h1>
      <p className="mb-6 max-w-md text-gray-500">
        {user 
          ? `You don't have sufficient permissions to access this page. Your current role is: ${user.role}.`
          : "You need to be logged in to access this page."}
      </p>
      <div className="space-x-4">
        <Button onClick={() => navigate(-1)} variant="outline">
          Go Back
        </Button>
        <Button onClick={() => navigate("/")}>
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default Unauthorized; 