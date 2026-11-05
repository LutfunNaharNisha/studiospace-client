import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/instrument-sans";
import Footer from "components/Footer";
import Navbar from "components/Navbar";
import Providers from "components/Providers";
import "./globals.css";

export const metadata = {
	title: {
		default: "StudioSpace | Book creative studios by the hour",
		template: "%s | StudioSpace",
	},
	description:
		"Peer-to-peer marketplace for photo studios, sound stages, podcast lounges, music suites and art workshops.",
};
export const viewport = { width: "device-width", initialScale: 1 };

// Runs before paint so the saved (or system) theme is applied without a flash.
const themeScript = `(function(){try{var t=localStorage.getItem('ss-theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'studiodark':'studiolight'}document.documentElement.setAttribute('data-theme',t)}catch(e){document.documentElement.setAttribute('data-theme','studiolight')}})();`;

export default function RootLayout({ children }) {
	return (
		<html
			lang="en"
			data-theme="studiolight"
			suppressHydrationWarning
		>
			<head>
				<script dangerouslySetInnerHTML={{ __html: themeScript }} />
			</head>
			<body className="flex min-h-screen flex-col bg-base-100 font-sans text-base-content antialiased">
				<Providers>
					<Navbar />
					<main className="flex-1">{children}</main>
					<Footer />
				</Providers>
			</body>
		</html>
	);
}
