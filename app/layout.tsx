import type { Metadata } from "next";
import "./index.css";

export const metadata: Metadata = {
  title: "Next.js Learning Lab",
  description:
    "An audio-first interactive memory palace for Daniel's Next.js learning journey.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
