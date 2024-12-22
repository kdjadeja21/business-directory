interface PageLayoutProps {
  children: React.ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1">{children}</main>
    </div>
  );
}
