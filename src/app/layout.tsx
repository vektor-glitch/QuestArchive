import type { Metadata } from "next";
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./global.css";
import Cursor from "../components/cursor";
import LenisProvider from "../components/lenisProvider";

config.autoAddCss = false

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-header",
});

config.autoAddCss = false;

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "QuestArchive",
  description: "....",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className={`${outfit.variable} ${plusJakarta.variable} min-h-full flex flex-col` >
        <LenisProvider>
          <Cursor />
          {children}
        </LenisProvider>
      </body>
    </html >
  );
}

