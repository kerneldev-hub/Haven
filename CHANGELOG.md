# HAVEN — CHANGELOG
All notable changes to the HAVEN project are documented below.

---

## [3.5.0] - 2026-06-25

### Added
- **Multi-Token Crypto Selector:** Integrated a modular, future-proof settlement selector into `CryptoPaymentModal.tsx` and `PricingPage.tsx`. Users can pay natively using BTC, ETH, SOL, LTC, and dual-network USDT (TRC20 on Tron or BEP20 on BNB Smart Chain).
- **Manual Compilation Console:** Created a terminal-grade visual playground inside `DownloadPage.tsx` explaining local Tauri v2 and Capacitor v8 build cycles for sovereign developers.
- **Robust Documentation Library:** Successfully deployed 10 separate markdown reports (`AUDIT_REPORT.md`, `ARCHITECTURE_REPORT.md`, etc.) outlining the entire application stack's audit findings, database layouts, and security matrices.

### Fixed
- **SQLite Database Corruption:** Completely repaired a critical database disk corruption issue in `local.db` by deleting the corrupt file, verifying constraints inside `/src/db/schema.ts`, and forcing a clean Drizzle ORM schema push.
- **USDT Dual-Network Switcher:** Fixed payment layout issues when users selected different BSC or TRON networks. The deposit wallet address and verification instructions now refresh dynamically based on the network choice.

### Removed
- **Fake Download Placeholders:** Purged outdated desktop download links that caused broken client routing, replaced with a polished "In Active Validation" platform roadmap with waitlist capabilities.
- **Legacy Payment Mock Functions:** Pruned orphaned billing variables and unified checking functions under the secure `CryptoPaymentModal` state container.
