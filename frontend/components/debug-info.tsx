"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/auth-store";
import { Card, CardBody } from "@heroui/card";

export default function DebugInfo() {
  const { user, isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Loading debug info...</div>;
  }

  return (
    <Card className="mb-4 border-yellow-200 bg-yellow-50">
      <CardBody className="p-4">
        <h3 className="font-bold text-yellow-800 mb-2">🐛 Debug Information</h3>
        <div className="space-y-1 text-sm text-yellow-700">
          <p>
            <strong>Mounted:</strong> {mounted ? "✅ Yes" : "❌ No"}
          </p>
          <p>
            <strong>User:</strong> {user ? `✅ ${user.email}` : "❌ No user"}
          </p>
          <p>
            <strong>Authenticated:</strong>{" "}
            {isAuthenticated ? "✅ Yes" : "❌ No"}
          </p>
          <p>
            <strong>User Object:</strong> {JSON.stringify(user, null, 2)}
          </p>
        </div>
      </CardBody>
    </Card>
  );
}
