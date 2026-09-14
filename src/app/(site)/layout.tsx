import { ModeToggle } from "@/components/mode-toggle";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

// Layout for the public site. /studio is outside this group on purpose.
export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="fixed top-4 right-4 z-[60]">
        <ModeToggle />
      </div>
      <Navbar />
      <div className="flex-grow pt-24">
        {children}
      </div>
      <Footer />
    </div>
  );
}
