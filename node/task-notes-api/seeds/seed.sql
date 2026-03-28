INSERT INTO users (email, password_hash, role)
VALUES
  ('admin@example.com', '$2b$10$8DkW4t0n1Q3tL2FQvK7W9eEqv1w4ZgM3bZxQn8vW7Xc3uW8DqzHnK', 'admin'),
  ('user@example.com', '$2b$10$8DkW4t0n1Q3tL2FQvK7W9eEqv1w4ZgM3bZxQn8vW7Xc3uW8DqzHnK', 'user')
ON CONFLICT (email) DO NOTHING;
