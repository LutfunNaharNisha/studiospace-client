"use client";
import { AuthProvider } from "components/AuthProvider";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }) {
	return (
		<AuthProvider>
			{children}
			<Toaster
				position="top-right"
				toastOptions={{
					duration: 3800,
					style: {
						background: "oklch(var(--b2))",
						color: "oklch(var(--bc))",
						border: "1px solid oklch(var(--b3))",
						borderRadius: "0.75rem",
						fontSize: "0.9rem",
					},
				}}
			/>
		</AuthProvider>
	);
}
