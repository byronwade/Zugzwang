import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Define protected routes that require authentication
const protectedRoutes = ["/account"];

// Auth-related constants - must match the ones in AUTH_CONFIG
const AUTH_COOKIE_NAMES = {
	accessToken: "accessToken",
	customerAccessToken: "customerAccessToken",
	idToken: "idToken",
};

// Helper function to check authentication
function isUserAuthenticated(request: NextRequest): boolean {
	const customerAccessToken = request.cookies.get(AUTH_COOKIE_NAMES.customerAccessToken);
	const accessToken = request.cookies.get(AUTH_COOKIE_NAMES.accessToken);
	const idToken = request.cookies.get(AUTH_COOKIE_NAMES.idToken);
	return !!customerAccessToken && !!accessToken && !!idToken;
}

// Helper function to add security headers
function addSecurityHeaders(response: NextResponse): void {
	response.headers.set("X-DNS-Prefetch-Control", "on");
	response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
	response.headers.set("X-Frame-Options", "SAMEORIGIN");
	response.headers.set("X-Content-Type-Options", "nosniff");
	response.headers.set("X-XSS-Protection", "1; mode=block");
	response.headers.set("Referrer-Policy", "origin-when-cross-origin");
	response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
	response.headers.set(
		"Content-Security-Policy",
		"default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.shopify.com https://*.googletagmanager.com https://*.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: blob:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://cdn.shopify.com https://*.shopify.com https://*.google-analytics.com; frame-src 'self' https://*.shopify.com;"
	);
}

// Helper function to handle protected routes
function handleProtectedRoute(request: NextRequest, pathname: string, isAuthenticated: boolean): NextResponse {
	if (isAuthenticated) {
		return NextResponse.next();
	}

	const url = new URL("/login", request.url);
	url.searchParams.set("callbackUrl", pathname);
	const response = NextResponse.redirect(url);
	response.headers.set("x-middleware-cache", "no-cache");
	return response;
}

// Helper function to handle auth routes
function handleAuthRoute(request: NextRequest, isAuthenticated: boolean): NextResponse {
	if (!isAuthenticated) {
		return NextResponse.next();
	}

	const callbackUrl = request.nextUrl.searchParams.get("callbackUrl");
	const redirectUrl =
		callbackUrl && protectedRoutes.some((route) => callbackUrl.startsWith(route))
			? new URL(callbackUrl, request.url)
			: new URL("/account", request.url);

	const response = NextResponse.redirect(redirectUrl);
	response.headers.set("x-middleware-cache", "no-cache");
	return response;
}

export function middleware(request: NextRequest): NextResponse {
	const { pathname } = request.nextUrl;
	const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
	const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register");
	const isAuthenticated = isUserAuthenticated(request);

	let response: NextResponse;

	if (isProtectedRoute) {
		response = handleProtectedRoute(request, pathname, isAuthenticated);
	} else if (isAuthRoute) {
		response = handleAuthRoute(request, isAuthenticated);
	} else {
		response = NextResponse.next();
	}

	addSecurityHeaders(response);
	return response;
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico).*)",
	],
};
