# Data Playground Module 11

This folder contains samples of the four core data formats used in modern software development, illustrating their intended purpose.

## File Usage and Context

### 1. samples.json (JSON)
* **Purpose:** Data exchange between systems and machines.
* **Context:** Used primarily for **APIs** (sending/receiving data to the front-end or other services) and application **logs**.
* **Key Feature:** Requires **strict syntax** (double quotes for keys and values, mandatory commas) which makes it easy for code (JavaScript, TypeScript, C++) to parse and generate.

### 2. config.yaml (YAML)
* **Purpose:** Configuration that is meant to be **edited by humans**.
* **Context:** Heavily used in DevSecOps for tools like **Docker Compose**, **Kubernetes**, and **GitHub Actions**. It defines how an application or service should be structured and run.
* **Key Feature:** Uses **indentation** to define structure instead of braces and brackets, making it highly readable and maintainable by humans. (Rule: JSON is for machines, YAML is for humans.)

### 3. samples.csv (CSV)
* **Purpose:** Simple, **tabular data** storage.
* **Context:** Used for data exports, simple datasets, and data that needs to be imported/viewed easily in **spreadsheet software**.
* **Key Feature:** Data is separated by a delimiter (usually a comma), with the first row typically serving as the header. It is the simplest data representation.

### 4. .env.example (Environment Variables)
* **Purpose:** Template for setting **secrets** and **environment-specific values**.
* **Context:** Used to store sensitive data like API keys, database credentials, and settings that differ between development, staging, and production environments.
* **Core Rule:** The actual `.env` file (containing real secrets) must **NEVER** be committed to Git. This `.env.example` template is committed to show other developers which keys they need to set up locally.