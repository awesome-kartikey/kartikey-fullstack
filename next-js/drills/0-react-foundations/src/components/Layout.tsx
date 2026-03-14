export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="layout-wrapper">
      <header className="layout-header">
        <h1>React Foundations Drills</h1>
      </header>
      <main className="layout-main">{children}</main>
      <footer className="layout-footer">
        <p>&copy;Kartikey Kumar</p>
      </footer>
    </div>
  );
}