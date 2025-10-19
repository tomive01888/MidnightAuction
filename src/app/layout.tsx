import type { Metadata } from "next";
import CssBaseline from "@mui/material/CssBaseline";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";
import ThemeRegistry from "@/theme/ThemeRegistry";
import { Noto_Sans_JP, Orbitron } from "next/font/google";
import { Container } from "@mui/material";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Providers from "@/components/Providers";

const noto = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-noto-sans-jp",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-orbitron",
});

export const metadata: Metadata = {
  title: "Midnight - Auction House",
  description: "Modern auction house platform for collectors",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${noto.variable} ${orbitron.variable}`} data-scroll-behavior="smooth">
      <body>
        <Providers>
          <ThemeRegistry>
            <CssBaseline />
            <AuthProvider>
              <Header />
              <Container
                component="main"
                maxWidth="lg"
                sx={{ flexGrow: 1, py: 4, margin: "0 auto", minHeight: "90vh" }}
              >
                {children}
              </Container>
              <Footer />
              <Toaster position="top-right" />
            </AuthProvider>
          </ThemeRegistry>
        </Providers>
        <div className="aurora-container" />
      </body>
    </html>
  );
}
