"use client";

import Background from "@/components/Background";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-full">
      {/* Background */}
      <div className="absolute inset-0 -z-10 w-full h-full">
        <Background />
      </div>
      
      {/* Content */}
      <div className="flex items-center justify-center min-h-screen">
        {children}
      </div>
    </div>
  );
}