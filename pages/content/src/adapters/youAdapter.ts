/**
 * You.com Adapter
 *
 * Adapter implementation for you.com chat
 */

import { BaseAdapter } from './common';
import { logMessage } from '../utils/helpers';
import { insertToolResultToChatInput, attachFileToChatInput, submitChatInput } from '../components/websites/youcom';
import { SidebarManager } from '../components/sidebar';
import { initYoucomComponents } from './adaptercomponents/you';

export class YouAdapter extends BaseAdapter {
  name = 'YouCom';
  hostname = ['you.com'];

  private lastUrl: string = '';
  private urlCheckInterval: number | null = null;

  constructor() {
    super();
    this.sidebarManager = SidebarManager.getInstance('youcom');
    logMessage('Created You.com sidebar manager instance');
  }

  protected initializeSidebarManager(): void {
    this.sidebarManager.initialize();
  }

  protected initializeObserver(forceReset: boolean = false): void {
    initYoucomComponents();
    if (!this.urlCheckInterval) {
      this.lastUrl = window.location.href;
      this.urlCheckInterval = window.setInterval(() => {
        const currentUrl = window.location.href;
        if (currentUrl !== this.lastUrl) {
          logMessage(`URL changed from ${this.lastUrl} to ${currentUrl}`);
          this.lastUrl = currentUrl;
          initYoucomComponents();
        }
      }, 1000);
    }
  }

  cleanup(): void {
    if (this.urlCheckInterval) {
      window.clearInterval(this.urlCheckInterval);
      this.urlCheckInterval = null;
    }
    super.cleanup();
  }

  insertTextIntoInput(text: string): void {
    insertToolResultToChatInput(text);
    logMessage(`Inserted text into You.com input: ${text.substring(0, 20)}...`);
  }

  triggerSubmission(): void {
    submitChatInput()
      .then(success => {
        logMessage(`Triggered You.com form submission: ${success ? 'success' : 'failed'}`);
      })
      .catch(error => {
        logMessage(`Error triggering You.com form submission: ${error}`);
      });
  }

  supportsFileUpload(): boolean {
    return true;
  }

  async attachFile(file: File): Promise<boolean> {
    try {
      return attachFileToChatInput(file);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      logMessage(`Error attaching file to You.com input: ${message}`);
      return false;
    }
  }

  public forceFullScan(): void {
    logMessage('Forcing full document scan for You.com');
  }
}
