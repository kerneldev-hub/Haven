# HAVEN — REAL-TIME SYSTEMS ENGINEERING REPORT
**Version:** 3.5.0  
**Provider:** Ably Pub/Sub Network  
**Scale Target:** 1,000+ Concurrent Active Users  
**Lead Engineer:** KERNEL Elite Systems Architect

This document details the configuration, channel patterns, WebSockets lifecycle, and message formats of the HAVEN live synchronization layer.

---

## 1. REAL-TIME CHANNEL TAXONOMY

By selecting **Ably** as our absolute single provider, we avoid competing WebSocket frameworks (Socket.io, Pusher) and consolidate all real-time events onto one high-performance, edge-replicated architecture.

Channels are isolated into logical namespaces:

| Channel Namespace | Scope | Active Events |
| :--- | :--- | :--- |
| `presence:room:<roomId>` | Room Group | User entry, device status, camera/mic states |
| `chat:conv:<convId>` | Private / Group DM | Messages, attachments, edits, deletion signals |
| `typing:conv:<convId>` | Dynamic UI | Active keystrokes (`typing_started` / `typing_stopped`) |
| `receipts:conv:<convId>` | Read Tracking | Message timestamps (`read_receipt` with messageId) |
| `signals:room:<roomId>` | WebRTC Signaling | SDP offers, SDP answers, ICE candidates |
| `user:sync:<userId>` | Personal Account | Global notifications, subscription upgrades |

---

## 2. DETAILED EVENT SPECIFICATIONS

### 2.1 Chat & Message Events
- **Event:** `message_sent`  
  Dispatched when a user publishes a payload. Clients reactively inject the message into their local state with zero-polling fallback.
  ```json
  {
    "id": "msg_908123098",
    "conversationId": "conv_abc123",
    "sender": { "id": "usr_7", "username": "kernel" },
    "content": "Building edge architecture.",
    "createdAt": 1782390123
  }
  ```

### 2.2 Typing Indicators (Low-latency)
- **Event:** `typing`  
  Clients debounce keystrokes locally. When typing begins, a message is published to the `typing` channel with a 3-second automatic fade-out to prevent network congestion.

### 2.3 Presence tracking
- Managed natively using **Ably Presence** state machines. Entering a workspace joins the client to the global presence ring, broadcasting their online status, device identifier (e.g. `pwa`, `web`), and active room focus.

### 2.4 WebRTC Signaling for Video & Audio Rooms
- Coordinated using transient channels on Ably. Peer connection endpoints swap Session Description Protocol (SDP) payloads and Interactive Connectivity Establishment (ICE) configurations in under 50ms, allowing direct media streaming between browsers.

---

## 3. EDGE RESILIENCY & RECONNECTION STRATEGY
- **Automatic Fallback:** The client SDK automatically downgrades to long polling or JSONP transport if direct WebSocket port 443 routes are restricted by enterprise firewalls.
- **Connection Recovery:** Ably handles transient packet loss with state recovery keys, automatically re-playing missed channel events when the network recovers.
- **Backpressure Handling:** Messages are queued on local client buffers and flushed sequentially on reconnection, guaranteeing zero duplicate messages or state loss.
