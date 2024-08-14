import type { Metadata } from "next";
import "./style.css";

export const metadata: Metadata = {
  title: "My Zod",
  description: "Zodを使ったフォームバリデーション",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <div className="wrapper">
          <h1 className="title">my zod</h1>
          {children}
        </div>
      </body>
    </html>
  );
}
