// Server component wrapper that forces dynamic rendering
export const dynamic = 'force-dynamic';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}