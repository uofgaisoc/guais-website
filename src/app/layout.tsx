import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google"; // Keep Geist_Mono for now as a secondary option if needed
import localFont from "next/font/local"; // Import localFont
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import { Navbar } from "@/components/Navbar"; // Import Navbar
import { Footer } from "@/components/Footer"; // Import Footer

// Define the custom local font "Neue Metana Mono"
const neueMetanaMono = localFont({
  src: [
    {
      path: "../../public/fonts/OTF/NeueMetanaMono-Light.otf",
      weight: "300", // Light
      style: "normal",
    },
    {
      path: "../../public/fonts/OTF/NeueMetanaMono-SemiBold.otf",
      weight: "600", // SemiBold
      style: "normal",
    },
  ],
  display: "swap", // Good practice for font display
  variable: "--font-neue-metana-mono", // CSS variable to be used in Tailwind and/or globals.css
});

// Keep Geist Mono as an alternative mono font if needed, or remove if Neue Metana Mono is the only mono
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GUAIS",
  description: "The official website of the Glasgow University AI Society",
  icons: [
    {
      rel: 'icon',
      url: '/circle_logo.png',
    },
    {
      rel: 'apple-touch-icon',
      url: '/circle_logo.png',
    }
  ],
  openGraph: {
    title: "Glasgow University AI Society",
    description: "The official website of the Glasgow University AI Society.",
    images: [
      {
        url: "/circle_logo.png",
        width: 512,
        height: 512,
        alt: "GUAIS Logo"
      }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body
        className={`${neueMetanaMono.variable} ${geistMono.variable} font-sans antialiased h-full`} // Apply Neue Metana Mono as primary, keep Geist Mono as secondary
        // 'font-sans' will be configured in tailwind.config.ts to use --font-neue-metana-mono
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen"> {/* Main flex container */}
            <div className="fixed top-4 right-4 z-[60]"> {/* Made ModeToggle fixed and increased z-index */}
              <ModeToggle />
            </div>
            <Navbar /> {/* Navbar has z-50 */}
            <div className="flex-grow pt-24"> {/* Content area that grows */}
              {children}
            </div>
            <Footer /> {/* Add Footer component */}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
