# Changelog

## [Unreleased]
- Added global maintenance mode: Only authenticated admins can access the app when enabled; all other users see a maintenance page.
- Maintenance mode can be toggled from the Operations Dashboard by an admin.
- The /auth route remains accessible for login during maintenance, but only admins can proceed.
- Improved SystemSettingsContext to ensure settings are always fetched and parsed correctly.
- Hardened MaintenanceGate logic to block all public/protected routes for non-admins during maintenance.
- Added extensive debug output for easier troubleshooting during development.
- Fixed session/role context issues to ensure robust authentication and access control.

# ...existing content...
