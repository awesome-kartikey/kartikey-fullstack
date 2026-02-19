# Server Process Investigation

This document records the steps taken to identify and terminate a running process listening on a network port, demonstrating core operations literacy.

## 1. Initial Server Setup
- **Port:** 5000
- **Command used:** `python3 -m http.server 5000`
- **Verification:** Verified working at http://localhost:5000.

## 2. Process Discovery
- **Tool used:** `lsof`
- **Command to find this:** `lsof -i :5000`
- **PID Found:** 24973
- **User Owner:** kartikey

## 3. Termination
- **Command used:** `kill 24974`
- **Result:** The server process in the other terminal stopped immediately, releasing Port 5000.

## 4. Restart Verification
- **New Port:** 7000
- **Command used:** `python3 -m http.server 7000`
- **Result:** Server restarted successfully on the new port, confirming Port 5000 was free and the process was cleanly terminated.