# LLM & Mentor Q&A Log

## Topic: JSON vs YAML
**My Question:** "When should I strictly use JSON over YAML? Why not use YAML for everything since it is easier to read?"

**Answer Summary:**
- JSON is stricter and safer for computers to parse. It is the standard for APIs (sending data over the web).
- YAML is slower to parse and indentation errors can be dangerous.
- **Rule:** Use YAML for configs (humans edit it). Use JSON for Data/APIs (machines read/write it).

**My Takeaway:** Don't use YAML for API responses.

## Topic: SSH Keys
**My Question:** "What is the difference between id_rsa and id_ed25519?"

**Answer Summary:**
- `rsa` is the old standard. Keys are long and big.
- `ed25519` is the modern standard (Elliptic Curve). Keys are tiny and much faster/secure.
- **Action:** Always generate `ed25519` keys for new servers.