# Testing Sandbox APIs (e.g., Stripe, GitHub)

1. **Environment Segregation:** Utilize `.env.test` vs `.env.development`. Provide sandbox test keys (`sk_test_...`) locally and mock everything in CI.
2. **Magic Values:** Leverage explicit provider test triggers. E.g., sending the credit card `4242 4242 4242 4242` to Stripe Test Mode guarantees a 200 Success, while `4000 0000 0000 0002` simulates a decline.
3. **Idempotency Strategy:** Ensure `POST` endpoints utilize predictable Idempotency Keys during test mode so dev resets do not generate duplicated test billings.
