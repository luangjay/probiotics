interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="container flex flex-1 border border-green-500">
      <section className="max-w-xs p-12 flex-1 w-full border border-black overflow-auto">
        sidetab
      </section>
      <section className="w-full p-12 flex-1 border border-black overflow-auto">
        {children}
      </section>
    </div>
  );
}
