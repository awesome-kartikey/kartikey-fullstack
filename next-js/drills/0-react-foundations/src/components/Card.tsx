interface CardProps {
  title?: string;
  children: React.ReactNode;
}

export default function Card({ title, children }: CardProps) {
  return (
    <div className="custom-card">
      {title && <h2 className="card-title">{title}</h2>}
      <div className="card-body">{children}</div>
    </div>
  );
}