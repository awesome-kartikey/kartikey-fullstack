export default function TasksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-6">
        <h2 className="text-lg text-gray-500">Task Management</h2>
      </div>
      {children}
    </div>
  );
}
