import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "사진 관리 | FAV HAIR" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
