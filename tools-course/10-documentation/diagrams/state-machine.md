# User Signup Flow

```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> FillingForm: Start Signup
    FillingForm --> Validating: Submit Form
    Validating --> FillingForm: Validation Error
    Validating --> Pending: Valid Data
    Pending --> EmailSent: Create Account
    EmailSent --> AwaitingVerification: Send Email
    AwaitingVerification --> Verified: Click Link
    AwaitingVerification --> Expired: Timeout
    Expired --> EmailSent: Resend Email
    Verified --> Active: Login
    Active --> [*]
    
```