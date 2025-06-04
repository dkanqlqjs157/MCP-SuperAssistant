import type { AdapterConfig, SimpleSiteAdapter } from './common';
import { initializeAdapter } from './common';

function findYouButtonInsertionPoint(): { container: Element; insertAfter: Element | null } | null {
  const sendButton = document.querySelector('button[type="submit"]');
  if (sendButton && sendButton.parentElement) {
    return { container: sendButton.parentElement, insertAfter: sendButton };
  }
  return null;
}

function onMCPEnabled(adapter: SimpleSiteAdapter | null): void {
  adapter?.sidebarManager?.show();
}

function onMCPDisabled(adapter: SimpleSiteAdapter | null): void {
  adapter?.sidebarManager?.hide();
}

const youAdapterConfig: AdapterConfig = {
  adapterName: 'YouCom',
  storageKeyPrefix: 'mcp-youcom-state',
  findButtonInsertionPoint: findYouButtonInsertionPoint,
  getStorage: () => localStorage,
  onMCPEnabled,
  onMCPDisabled,
};

export function initYoucomComponents(): void {
  initializeAdapter(youAdapterConfig);
}
