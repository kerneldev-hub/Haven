# Haven OS Developer Integration & Plugin Guide

Welcome to the **Haven OS Sandboxed Plugin SDK**. This guide provides everything you need to craft custom Extensions, automate workspace files, inject custom stylesheets, or emulate webhooks within secure execution environments of Haven OS.

---

## 1. Sandbox Security Architecture

Haven OS implements a **Virtual Closed Sandbox** pattern to run untrusted developer extensions in the browser. 

### Why is this secure?
1. **Proxy Isolation**: All global objects like `window`, `document`, `parent`, `top`, `fetch`, and `XMLHttpRequest` are intercepted and replaced with `undefined` in the plugin execution closure.
2. **Strict Opt-in Permissions**: External scripts have absolutely **zero** access to data handles unless explicitly authorized by the project system administrator.
3. **Audit Trail**: Every transaction is parsed, categorized as `GRANTED` or `DENIED`, and written to the live console console pipeline.

---

## 2. Setting Up an Extension Layout

Every Extension structure matches the `HavenExtension` schema defined in `src/types.ts`:

```typescript
export interface HavenExtension {
  id: string;
  name: string;
  desc: string;
  category: 'workspace' | 'assistant' | 'community' | 'general' | 'developer';
  author: string;
  active: boolean;
  permissions: string[];         // Declared claims
  grantedPermissions: string[];  // User-approved bounds
}
```

---

## 3. Sandboxed API Methods (`HavenAPI`)

When an extension compiles inside the virtual sandbox, it receives a globally isolated context handle called `HavenAPI`.

Here is the exact API mapping:

| Method Target | Required Permission | Description |
| :--- | :--- | :--- |
| `readWorkspaceFiles()` | `Read Workspace Files` | Retrieves a dictionary mapping file paths to content strings. |
| `writeWorkspaceFile(path, content)` | `Write Workspace Files` | Appends or updates a file in the active workspace context. |
| `injectCSS(css)` | `Inject CSS` | Dynamically appends responsive CSS rules to the main page header. |
| `notifyUser(message, type)` | *None (Unrestricted)* | Fires a toast notification (`info` / `success` / `warning` / `error`). |
| `getSavedMemories()` | `Read Memories` | Accesses strategic memory banks synced during active assistant chat. |
| `triggerWebhookSim(payload)` | `Mock Webhook Events` | Sends structured event telemetries directly into dev logs for testing. |

---

## 4. Code Snippets & Cookbook

### Template A: CSS Customizer Style Injector
```javascript
// Extension Name: Dark Amber Accent Theme
// Permissions claim: "Inject CSS"

const customTheme = `
  .haven-card-accent {
    border: 1px solid rgba(245, 158, 11, 0.2) !important;
    background: rgba(12, 10, 9, 0.96) !important;
    box-shadow: 0 4px 20px rgba(245, 158, 11, 0.1);
  }
`;

const status = HavenAPI.injectCSS(customTheme);

if (status) {
  HavenAPI.notifyUser("Amber layout theme successfully mounted!", "success");
} else {
  HavenAPI.notifyUser("Failed to inject design layer styles.", "error");
}
```

### Template B: Workspace Markdown Parser & Organizer
```javascript
// Extension Name: Readme Metadata Auditor
// Permissions claim: "Read Workspace Files", "Write Workspace Files"

async function auditDocumentation() {
  const files = HavenAPI.readWorkspaceFiles();
  let foundReadme = false;
  
  for (const [path, content] of Object.entries(files)) {
    if (path.toLowerCase().includes('readme.md')) {
      foundReadme = true;
      break;
    }
  }
  
  if (!foundReadme) {
    // Generate an empty README outline
    const outline = "# Applet Workspace\n\nGenerated automatically via sandboxed agent.";
    const writeOk = HavenAPI.writeWorkspaceFile("README.md", outline);
    if (writeOk) {
      HavenAPI.notifyUser("Created default workspace documentation boilerplate.", "info");
    }
  } else {
    HavenAPI.notifyUser("Documentation is already structured correctly.", "success");
  }
}

auditDocumentation();
```

---

## 5. Deployment Checklist & Best Practices

1. **Defensive Validation**: Always wrap core file parsers in `try / catch` blocks inside your scripts.
2. **UI Interruption Blockers**: Never compile infinite loops. The sandboxed browser loop reserves thread capacity and will auto-terminate long-running operations.
3. **No Network Access**: The sandboxed script is completely offline. Any attempt to use `fetch` or call external resources over HTTP will throw an immediate browser runtime exception. Run integrations server-side if network connection is needed.
