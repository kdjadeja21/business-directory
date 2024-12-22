import { Footer } from "@/components/Footer";

export default function ProfileCardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen flex flex-col">{children}</div>;
}
