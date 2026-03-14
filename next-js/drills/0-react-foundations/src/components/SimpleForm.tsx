import { useState } from 'react';

export default function SimpleForm() {
  const [user, setUser] = useState({ name: '', email: '' });

  return (
    <form className="simple-form">
      <input
        className="input-field"
        value={user.name}
        onChange={(e) => setUser({ ...user, name: e.target.value })}
        placeholder="Your name"
      />
      <input
        className="input-field"
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
        placeholder="Your email"
      />
      <p>Hello, {user.name || 'Guest'} We'll contact you at {user.email}.</p>
    </form>
  );
}