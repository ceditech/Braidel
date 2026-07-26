import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "braid.el | The Braiding Industry Platform",
  description:
    "Connect salons with skilled braiders. Find work. Book services. Grow your business.",
};

const themeScript = `
  (() => {
    try {
      const savedTheme = localStorage.getItem("braidel-theme");
      document.documentElement.dataset.theme =
        savedTheme === "light" || savedTheme === "dark" ? savedTheme : "dark";
    } catch {
      document.documentElement.dataset.theme = "dark";
    }
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        </head>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
