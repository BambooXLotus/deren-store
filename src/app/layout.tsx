import { ModalProvider } from "@/providers/modal-provider";
import { QueryProvider } from "@/providers/query-provider";
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
        <body>
          <QueryProvider>
            <ModalProvider />
            {children}
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
