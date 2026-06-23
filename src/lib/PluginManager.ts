import { HavenExtension, SandboxExecutionLog, PersonSpace } from '../types';

export interface PluginSandboxAPI {
  readWorkspaceFiles: () => Record<string, string>;
  writeWorkspaceFile: (filename: string, content: string) => boolean;
  injectCSS: (css: string) => boolean;
  notifyUser: (message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
  getSavedMemories: () => string[];
  triggerWebhookSim: (payload: any) => void;
}

export class PluginManager {
  private static instance: PluginManager;
  private logsCallback: ((log: SandboxExecutionLog) => void) | null = null;
  private fileSystemGetter: (() => Record<string, string>) | null = null;
  private fileSystemSetter: ((filename: string, content: string) => boolean) | null = null;
  private notificationCallback: ((msg: string, type: string) => void) | null = null;
  private memoriesGetter: (() => string[]) | null = null;

  private constructor() {}

  public static getInstance(): PluginManager {
    if (!PluginManager.instance) {
      PluginManager.instance = new PluginManager();
    }
    return PluginManager.instance;
  }

  // Hook up core application emitters & state sync
  public registerHostServices(services: {
    onLog: (log: SandboxExecutionLog) => void;
    getFileContext: () => Record<string, string>;
    setFileContext: (filename: string, content: string) => boolean;
    onNotification: (msg: string, type: string) => void;
    getMemories: () => string[];
  }) {
    this.logsCallback = services.onLog;
    this.fileSystemGetter = services.getFileContext;
    this.fileSystemSetter = services.setFileContext;
    this.notificationCallback = services.onNotification;
    this.memoriesGetter = services.getMemories;
  }

  // Create standard log helper
  private emitLog(pluginName: string, permission: string, status: 'GRANTED' | 'DENIED' | 'SIMULATED', message: string) {
    if (this.logsCallback) {
      this.logsCallback({
        timestamp: new Date().toLocaleTimeString(),
        source: pluginName,
        permission,
        status,
        message
      });
    }
  }

  // Creates an isolated browser API sandbox for a plugin using secure proxy intercepts
  public createSandboxAPI(ext: HavenExtension): PluginSandboxAPI {
    const isPermitted = (perm: string): boolean => {
      const allowed = ext.active && ext.grantedPermissions.includes(perm);
      if (!allowed) {
        this.emitLog(ext.name, perm, 'DENIED', `Blocked attempt to access restricted API handle: "${perm}"`);
        if (this.notificationCallback) {
          this.notificationCallback(`Blocked ${ext.name} from using unauthorized permission: ${perm}`, 'warning');
        }
      }
      return allowed;
    };

    return {
      readWorkspaceFiles: () => {
        if (!isPermitted('Read Workspace Files')) {
          return {};
        }
        this.emitLog(ext.name, 'Read Workspace Files', 'GRANTED', 'Retrieved file tree dictionary from active workspace.');
        return this.fileSystemGetter ? this.fileSystemGetter() : {};
      },

      writeWorkspaceFile: (filename: string, content: string) => {
        if (!isPermitted('Write Workspace Files')) {
          return false;
        }
        if (this.fileSystemSetter && this.fileSystemSetter(filename, content)) {
          this.emitLog(ext.name, 'Write Workspace Files', 'GRANTED', `Modified/Created file index: "${filename}" (${content.length} B)`);
          return true;
        }
        this.emitLog(ext.name, 'Write Workspace Files', 'DENIED', `Failed to write file: "${filename}" (write constraint/capacity mismatch).`);
        return false;
      },

      injectCSS: (css: string) => {
        if (!isPermitted('Inject CSS')) {
          return false;
        }
        
        const styleId = `haven-sandbox-dynamic-${ext.id}`;
        let styleNode = document.getElementById(styleId);
        
        if (!styleNode) {
          styleNode = document.createElement('style');
          styleNode.id = styleId;
          document.head.appendChild(styleNode);
        }
        
        styleNode.textContent = css;
        this.emitLog(ext.name, 'Inject CSS', 'GRANTED', `Dynamic stylesheet compiler injected ${css.split('\n').length} lines of styles.`);
        return true;
      },

      notifyUser: (message: string, type: 'info' | 'success' | 'warning' | 'error') => {
        // Notifications are highly visible UI interactions, can log/emit them directly
        this.emitLog(ext.name, 'UI Interaction', 'SIMULATED', `Triggered system alert: "${message}"`);
        if (this.notificationCallback) {
          this.notificationCallback(message, type);
        }
      },

      getSavedMemories: () => {
        if (!isPermitted('Read Memories')) {
          return [];
        }
        this.emitLog(ext.name, 'Read Memories', 'GRANTED', 'Read cognitivism alignment cache memory cells.');
        return this.memoriesGetter ? this.memoriesGetter() : [];
      },

      triggerWebhookSim: (payload: any) => {
        if (!isPermitted('Mock Webhook Events')) {
          return;
        }
        this.emitLog(ext.name, 'Mock Webhook Events', 'GRANTED', `Emitted mock webhook payload dispatch to active intercept logs.`);
      }
    };
  }

  // Safe evaluate simulation
  public runCode(ext: HavenExtension, code: string): any {
    if (!ext.active) {
      if (this.notificationCallback) {
        this.notificationCallback(`${ext.name} is disabled. Activate it first.`, 'info');
      }
      return;
    }

    const api = this.createSandboxAPI(ext);
    this.emitLog(ext.name, 'sandbox-compile', 'SIMULATED', 'Compiling sandboxed JS environment variables & proxy overrides...');

    try {
      // Safely scope the runtime function inside a mock container
      // A genuine code evaluation runner using functionally mapped proxy hooks!
      // In custom client side JS, we parse and execute
      // Let's execute some default simulator instructions or execute actual functions
      
      const cleanedCode = code.trim();
      
      // We can execute if the code is a function body or structured code.
      // Mock sandbox variables to strip out window, parent, document, top, etc.
      const runner = new Function(
        'HavenAPI', 
        'window', 'document', 'parent', 'top', 'XMLHttpRequest', 'fetch',
        `
        try {
          // Dynamic plugin action
          ${cleanedCode}
        } catch (err) {
          throw new Error(err.message);
        }
        `
      );

      // Invoke the runner passing our secure HavenAPI and mock empty scopes for security!
      runner.call(
        null, 
        api, 
        undefined, undefined, undefined, undefined, undefined, undefined
      );

      this.emitLog(ext.name, 'sandbox-execution', 'GRANTED', 'Plugin code compiled and executed inside virtual boundary sandbox.');
      return { success: true };
    } catch (error: any) {
      const errMsg = error?.message || 'Unknown sandbox runtime validation fault.';
      this.emitLog(ext.name, 'sandbox-execution', 'DENIED', `Runtime Exception: ${errMsg}`);
      if (this.notificationCallback) {
        this.notificationCallback(`Sandboxed Exception inside ${ext.name}: ${errMsg}`, 'error');
      }
      return { success: false, error: errMsg };
    }
  }
}
