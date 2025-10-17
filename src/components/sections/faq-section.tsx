"use client";

import { HelpCircle, Plus } from "lucide-react";
import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

type FAQ = {
	question: string;
	answer: string;
};

const ALL_FAQS: FAQ[] = [
	{
		question: "Are your products suitable for beginners?",
		answer: "Yes! Our products are designed with all skill levels in mind and include detailed step-by-step instructions. They require minimal setup and are perfect for first-time users.",
	},
	{
		question: "What warranty or guarantee comes with your products?",
		answer: "All products come with our standard 1-year warranty against manufacturing defects. We also offer a 30-day satisfaction guarantee on all purchases.",
	},
	{
		question: "Do you offer bulk pricing?",
		answer: "Absolutely! Orders over $150 receive automatic volume discounts, and we offer special wholesale pricing for commercial operations. Contact us for custom quotes on large orders.",
	},
	{
		question: "How long does shipping typically take?",
		answer: "Standard shipping takes 3-5 business days. We offer expedited shipping options for 1-2 day delivery. All orders are processed within 24 hours on business days.",
	},
	{
		question: "What payment methods do you accept?",
		answer: "We accept all major credit cards (Visa, Mastercard, Amex), PayPal, Apple Pay, and Shop Pay for your convenience.",
	},
	{
		question: "Can I track my order?",
		answer: "Yes! Once your order ships, you'll receive a tracking number via email. You can also track your order status by logging into your account.",
	},
	{
		question: "What is your return policy?",
		answer: "We offer a 30-day return policy for unused products in original packaging. If you're not satisfied, contact our support team for a full refund or exchange.",
	},
	{
		question: "Do you ship internationally?",
		answer: "Currently we ship within the United States. For international orders, please contact our support team for special arrangements.",
	},
	{
		question: "How do I care for my products?",
		answer: "Each product comes with detailed care instructions. Most items should be stored in a cool, dry place away from direct sunlight. Specific care guidelines are included with your order.",
	},
	{
		question: "Are your products organic/certified?",
		answer: "Yes, many of our products are certified organic and lab-tested. Look for the certification badges on individual product pages for specific details.",
	},
	{
		question: "What if I receive a damaged item?",
		answer: "If your item arrives damaged, please contact us within 48 hours with photos. We'll arrange for a replacement or full refund immediately.",
	},
	{
		question: "Do you offer gift cards?",
		answer: "Yes! Gift cards are available in various denominations and make perfect gifts for mushroom enthusiasts. They never expire and can be used on any product.",
	},
	{
		question: "How do I contact customer support?",
		answer: "You can reach our support team via email, phone, or live chat during business hours (Mon-Fri, 9am-5pm EST). We typically respond within 2 hours.",
	},
	{
		question: "Are there any subscription options?",
		answer: "Yes! We offer subscription boxes with recurring deliveries at discounted rates. You can customize your subscription and pause or cancel anytime.",
	},
	{
		question: "What makes your products different from competitors?",
		answer: "Our products are lab-tested for quality, sourced from trusted suppliers, and backed by expert support. We prioritize customer satisfaction and offer comprehensive guarantees.",
	},
	{
		question: "Do you offer educational resources?",
		answer: "Absolutely! We provide free guides, video tutorials, and a knowledge base to help you succeed. Our blog also features tips and best practices.",
	},
	{
		question: "Can I cancel or modify my order after placing it?",
		answer: "Orders can be modified or cancelled within 2 hours of placement. After that, please contact support and we'll do our best to accommodate your request.",
	},
	{
		question: "What are your business hours?",
		answer: "Our online store is open 24/7. Customer support is available Monday-Friday, 9am-5pm EST. Orders placed on weekends are processed on the next business day.",
	},
	{
		question: "Do you have a physical store location?",
		answer: "We operate primarily online to keep costs low and pass savings to you. However, we do offer local pickup options in select areas.",
	},
	{
		question: "How do I know which product is right for me?",
		answer: "Check our product comparison guides or contact our expert team. We're happy to provide personalized recommendations based on your needs and experience level.",
	},
	{
		question: "Are there any storage requirements for your products?",
		answer: "Most products should be stored in a cool (60-70°F), dry place. Avoid extreme temperatures and direct sunlight. Specific storage instructions are on product labels.",
	},
	{
		question: "What is your privacy policy?",
		answer: "We take your privacy seriously and never share your personal information. All data is encrypted and securely stored. View our full privacy policy in the footer.",
	},
	{
		question: "Do you offer wholesale or commercial pricing?",
		answer: "Yes! We have special pricing for commercial operations, research facilities, and bulk orders. Contact our sales team for a custom quote.",
	},
	{
		question: "How often do you restock products?",
		answer: "Popular items are restocked weekly. You can sign up for restock notifications on out-of-stock product pages to be alerted when items return.",
	},
	{
		question: "What safety measures do you take for shipping?",
		answer: "All products are packaged discreetly and securely to prevent damage during transit. Temperature-sensitive items include cooling packs when necessary.",
	},
	{
		question: "Can I leave a product review?",
		answer: "Yes! We encourage reviews. After your purchase, you'll receive an email invitation to share your experience. Your feedback helps other customers make informed decisions.",
	},
	{
		question: "Do you offer price matching?",
		answer: "We strive to offer competitive prices. While we don't have a formal price match policy, contact us if you find a lower price and we'll do our best to work with you.",
	},
	{
		question: "What if I need help after my purchase?",
		answer: "Our support doesn't end at checkout! Reach out anytime with questions about product use, troubleshooting, or general guidance. We're here to help you succeed.",
	},
	{
		question: "Are your packaging materials eco-friendly?",
		answer: "Yes! We use recyclable and biodegradable packaging materials whenever possible. We're committed to reducing our environmental impact.",
	},
	{
		question: "How do I apply a discount code?",
		answer: "Enter your discount code at checkout in the 'Promo Code' field before completing your purchase. Codes are case-sensitive and cannot be combined unless specified.",
	},
];

export function FAQSection() {
	const [visibleCount, setVisibleCount] = useState(5);
	const ITEMS_PER_LOAD = 5;
	const MAX_ITEMS = 30;

	const visibleFaqs = ALL_FAQS.slice(0, Math.min(visibleCount, MAX_ITEMS));
	const hasMore = visibleCount < MAX_ITEMS && visibleCount < ALL_FAQS.length;

	const loadMore = () => {
		setVisibleCount((prev) => Math.min(prev + ITEMS_PER_LOAD, MAX_ITEMS));
	};

	return (
		<div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-lg sm:col-span-2 sm:p-8 md:col-span-4 lg:col-span-6">
			<div className="mb-6 flex items-center gap-3">
				<div className="rounded-lg bg-primary/10 p-3 text-primary">
					<HelpCircle className="h-7 w-7" />
				</div>
				<div>
					<h3 className="font-bold text-foreground text-xl sm:text-2xl">Frequently Asked Questions</h3>
					<p className="text-muted-foreground text-sm">
						Everything you need to know about our products and services
					</p>
				</div>
			</div>

			<Accordion type="single" collapsible className="w-full">
				{visibleFaqs.map((faq, index) => (
					<AccordionItem key={index} value={`item-${index}`}>
						<AccordionTrigger className="text-left hover:text-primary">{faq.question}</AccordionTrigger>
						<AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>

			{hasMore && (
				<div className="mt-6 text-center">
					<Button onClick={loadMore} size="lg" variant="outline">
						<Plus className="mr-2 h-4 w-4" />
						Load More Questions ({Math.min(ITEMS_PER_LOAD, ALL_FAQS.length - visibleCount)} more)
					</Button>
				</div>
			)}

			{visibleCount >= MAX_ITEMS && ALL_FAQS.length > MAX_ITEMS && (
				<p className="mt-4 text-center text-muted-foreground text-sm">
					Showing {MAX_ITEMS} of {ALL_FAQS.length} questions. Contact support for more help.
				</p>
			)}
		</div>
	);
}
