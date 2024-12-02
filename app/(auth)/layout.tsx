import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
	return <main className="min-w-screen flex items-center justify-center bg-background">{children}</main>;
}
