import "@/styles/globals.css";

import { ClerkProvider } from "@clerk/nextjs";

export const metadata = {
  title: "Deren Store",
  description: "Deren Store, I sell stuff that make you think about your ex",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
