"use client";
import { ProfileProvider } from "@/app/hook/profileContext";
import Header from "../component/header";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ProfileProvider>
          <Header />
          {children}
        </ProfileProvider>
      </body>
    </html>
  );
}
