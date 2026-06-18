import { MinaSidorSidebar, MinaSidorMobileNav } from "./mina-sidor-nav";

export default function MinaSidorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <MinaSidorSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <MinaSidorMobileNav />
        {children}
      </div>
    </div>
  );
}
