export const runtime = "edge";
export const preferredRegion = "auto";
export const revalidate = 0;

import { Suspense } from "react";

// Add loading state
const loading = (
	<div className="flex items-center justify-center min-h-screen">
		<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
	</div>
);

export default async function Home() {
	return (
		<Suspense fallback={loading}>
			<div>Home</div>
		</Suspense>
	);
}
