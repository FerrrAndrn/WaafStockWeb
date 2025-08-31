# WaafStock Web

Web app with Manager and Staff roles. Fully integrated with WaafStock Server API. Managers handle approvals and reporting, while Staff submit requests.

## Features
### Manager Role
- Login with Manager credentials
- Approve or reject item requests
- View inventory list with stock details
- Monitor request history (per user, per date, per item)
- Dashboard with charts for insights:
  - Total requests
  - Approved vs Rejected
  - Top requested items
  - Inventory usage trends

### Staff Role
- Login with Staff credentials
- Submit item requests
- View current status of requests (pending, approved, rejected)
- Access personal request history

---

## ⚠️ Note
**Because this project uses a local server, all clients (web & mobile) must be on the same network as the server. Make sure to replace every `API_URL` in the JS files with your SERVER IP address (not localhost).**
