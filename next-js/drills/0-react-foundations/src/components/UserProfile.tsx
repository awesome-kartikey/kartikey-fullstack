interface UserProfileProps {
  name: string;
  email: string;
  role: string;
}

export default function UserProfile({ name, email, role }: UserProfileProps) {
  return (
    <div className="user-profile">
      <h3>{name}</h3>
      <p>Email: {email}</p>
      <span className="badge">{role}</span>
    </div>
  );
}