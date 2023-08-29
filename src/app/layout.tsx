import "@/styles/globals.css";

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
    <html lang="en">
      <>
        <>{children}</>
      </>
    </html>
  );
}
