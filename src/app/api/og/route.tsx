import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);

		// Get parameters
		const title = searchParams.get("title") || "Zugzwang";
		const description = searchParams.get("description") || "Next.js 16 + Shopify Storefront Template";
		const price = searchParams.get("price");
		const image = searchParams.get("image");
		const type = searchParams.get("type") || "default"; // default, product, collection, article
		// Use absolute URL for logo - @vercel/og requires absolute URLs
		const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || "https://yourdomain.com";
		const logo = searchParams.get("logo") || `${baseUrl}/icon-192x192.png`;

		return new ImageResponse(
			<div
				style={{
					height: "100%",
					width: "100%",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: "#ffffff",
					backgroundImage: "linear-gradient(135deg, #2A6592 0%, #3B82F6 50%, #C18A3C 100%)",
				}}
			>
				{/* Background Pattern */}
				<div
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						opacity: 0.1,
						backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
					}}
				/>

				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						width: "1200px",
						height: "630px",
						padding: "60px",
						backgroundColor: "rgba(255, 255, 255, 0.95)",
						borderRadius: "20px",
						boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
					}}
				>
					{/* Logo */}
					<div
						style={{
							display: "flex",
							alignItems: "center",
							marginBottom: "40px",
						}}
					>
						<img
							alt="Logo"
							height="60"
							src={logo}
							style={{
								marginRight: "20px",
							}}
							width="60"
						/>
						<div
							style={{
								fontSize: "24px",
								fontWeight: "bold",
								color: "#4a5568",
							}}
						>
							{process.env.NEXT_PUBLIC_STORE_NAME?.toUpperCase() || "ZUGZWANG"}
						</div>
					</div>

					{/* Content Area */}
					<div
						style={{
							display: "flex",
							width: "100%",
							alignItems: "center",
							justifyContent: "space-between",
						}}
					>
						{/* Text Content */}
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								flex: 1,
								paddingRight: image ? "40px" : "0",
							}}
						>
							{/* Badge */}
							{type === "product" && price && (
								<div
									style={{
										display: "flex",
										alignItems: "center",
										backgroundColor: "#48bb78",
										color: "white",
										padding: "8px 16px",
										borderRadius: "20px",
										fontSize: "18px",
										fontWeight: "bold",
										marginBottom: "20px",
										alignSelf: "flex-start",
									}}
								>
									{price}
								</div>
							)}

							{type === "collection" && (
								<div
									style={{
										display: "flex",
										alignItems: "center",
										backgroundColor: "#805ad5",
										color: "white",
										padding: "8px 16px",
										borderRadius: "20px",
										fontSize: "16px",
										fontWeight: "bold",
										marginBottom: "20px",
										alignSelf: "flex-start",
									}}
								>
									COLLECTION
								</div>
							)}

							{type === "article" && (
								<div
									style={{
										display: "flex",
										alignItems: "center",
										backgroundColor: "#3182ce",
										color: "white",
										padding: "8px 16px",
										borderRadius: "20px",
										fontSize: "16px",
										fontWeight: "bold",
										marginBottom: "20px",
										alignSelf: "flex-start",
									}}
								>
									ARTICLE
								</div>
							)}

							{/* Title */}
							<h1
								style={{
									fontSize: image ? "48px" : "56px",
									fontWeight: "bold",
									color: "#1a202c",
									lineHeight: 1.2,
									marginBottom: "20px",
									display: "-webkit-box",
									WebkitLineClamp: 2,
									WebkitBoxOrient: "vertical",
									overflow: "hidden",
								}}
							>
								{title}
							</h1>

							{/* Description */}
							<p
								style={{
									fontSize: "20px",
									color: "#4a5568",
									lineHeight: 1.6,
									marginBottom: "30px",
									display: "-webkit-box",
									WebkitLineClamp: 3,
									WebkitBoxOrient: "vertical",
									overflow: "hidden",
								}}
							>
								{description}
							</p>

							{/* Features */}
							<div
								style={{
									display: "flex",
									gap: "20px",
									marginTop: "auto",
								}}
							>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										fontSize: "16px",
										color: "#718096",
									}}
								>
									<svg fill="currentColor" height="20" style={{ marginRight: "8px" }} viewBox="0 0 20 20" width="20">
										<path d="M10 2a8 8 0 100 16 8 8 0 000-16zm3.707 5.293a1 1 0 00-1.414 0L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 000-1.414z" />
									</svg>
									Free Shipping
								</div>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										fontSize: "16px",
										color: "#718096",
									}}
								>
									<svg fill="currentColor" height="20" style={{ marginRight: "8px" }} viewBox="0 0 20 20" width="20">
										<path d="M10 2a8 8 0 100 16 8 8 0 000-16zm3.707 5.293a1 1 0 00-1.414 0L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 000-1.414z" />
									</svg>
									Expert Support
								</div>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										fontSize: "16px",
										color: "#718096",
									}}
								>
									<svg fill="currentColor" height="20" style={{ marginRight: "8px" }} viewBox="0 0 20 20" width="20">
										<path d="M10 2a8 8 0 100 16 8 8 0 000-16zm3.707 5.293a1 1 0 00-1.414 0L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 000-1.414z" />
									</svg>
									30-Day Returns
								</div>
							</div>
						</div>

						{/* Product Image */}
						{image && (
							<div
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									width: "400px",
									height: "400px",
									borderRadius: "20px",
									overflow: "hidden",
									boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
									backgroundColor: "#f7fafc",
								}}
							>
								<img
									alt="Product"
									src={image}
									style={{
										width: "100%",
										height: "100%",
										objectFit: "cover",
									}}
								/>
							</div>
						)}
					</div>
				</div>
			</div>,
			{
				width: 1200,
				height: 630,
			}
		);
	} catch (_e) {
		return new Response("Failed to generate image", {
			status: 500,
		});
	}
}
