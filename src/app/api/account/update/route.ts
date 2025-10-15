import { cookies } from "next/headers";

export async function POST(request: Request) {
	try {
		// Get the current token
		const cookieStore = await cookies();
		const token = cookieStore.get("customerAccessToken");

		if (!token) {
			return Response.json({ message: "Not authenticated" }, { status: 401 });
		}

		const { firstName, lastName, email, phone } = await request.json();

		// Update customer using Shopify Storefront API
		const shopDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
		const response = await fetch(`https://${shopDomain}/api/2024-01/graphql`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-Shopify-Storefront-Access-Token": process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN as string,
			},
			body: JSON.stringify({
				query: `
					mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
						customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
							customer {
								id
								firstName
								lastName
								email
								phone
							}
							customerUserErrors {
								code
								field
								message
							}
						}
					}
				`,
				variables: {
					customerAccessToken: token.value,
					customer: {
						firstName,
						lastName,
						email,
						phone,
					},
				},
			}),
		});

		const { data, errors } = await response.json();

		if (errors) {
			return Response.json({ message: errors[0].message }, { status: 400 });
		}

		const { customerUpdate } = data;

		if (customerUpdate.customerUserErrors?.length > 0) {
			const error = customerUpdate.customerUserErrors[0];
			return Response.json({ message: error.message }, { status: 400 });
		}

		return Response.json({
			success: true,
			customer: customerUpdate.customer,
		});
	} catch (error) {
		return Response.json(
			{
				message: error instanceof Error ? error.message : "Failed to update profile",
			},
			{ status: 500 }
		);
	}
}
