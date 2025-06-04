import { logMessage } from '@src/utils/helpers';

let lastFoundInputElement: HTMLElement | null = null;

export const findChatInputElement = (): HTMLElement | null => {
  const selectors = [
    'textarea',
    'div[contenteditable="true"]',
    'input[type="text"]',
    'input[placeholder]',
    'textarea[placeholder]'
  ];
  for (const selector of selectors) {
    const el = document.querySelector(selector);
    if (el && (el as HTMLElement).offsetParent !== null) {
      lastFoundInputElement = el as HTMLElement;
      logMessage(`Found You.com input via selector: ${selector}`);
      return el as HTMLElement;
    }
  }
  if (lastFoundInputElement && document.body.contains(lastFoundInputElement)) {
    return lastFoundInputElement;
  }
  logMessage('Could not find You.com input element');
  return null;
};

export const insertTextToChatInput = (text: string): boolean => {
  const input = findChatInputElement();
  if (!input) return false;
  try {
    if ('value' in input) {
      const el = input as HTMLInputElement | HTMLTextAreaElement;
      const current = el.value;
      el.value = current ? `${current}\n\n${text}` : text;
      const evt = new InputEvent('input', { bubbles: true });
      el.dispatchEvent(evt);
      el.focus();
      return true;
    }
    if (input.getAttribute('contenteditable') === 'true') {
      input.focus();
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(input);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);
      document.execCommand('insertText', false, (input.textContent ? '\n\n' : '') + text);
      const evt = new InputEvent('input', { bubbles: true });
      input.dispatchEvent(evt);
      return true;
    }
    input.textContent = (input.textContent || '') + '\n\n' + text;
    const evt = new InputEvent('input', { bubbles: true });
    input.dispatchEvent(evt);
    input.focus();
    return true;
  } catch (e) {
    logMessage(`Error inserting text into You.com input: ${e}`);
    return false;
  }
};

export const insertToolResultToChatInput = (result: string): boolean => {
  return insertTextToChatInput(result);
};

export const attachFileToChatInput = (file: File): boolean => {
  const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement | null;
  if (!fileInput) return false;
  try {
    const dt = new DataTransfer();
    dt.items.add(file);
    fileInput.files = dt.files;
    fileInput.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  } catch {
    return false;
  }
};

export const submitChatInput = async (): Promise<boolean> => {
  const selectors = [
    'button[type="submit"]',
    'button[aria-label="Send"]',
    'button.send-button',
    'button[data-testid="send-button"]'
  ];
  let button: HTMLElement | null = null;
  for (const sel of selectors) {
    const el = document.querySelector(sel);
    if (el && el instanceof HTMLElement) { button = el; break; }
  }
  if (button) {
    button.click();
    return true;
  }
  const input = findChatInputElement();
  if (!input) return false;
  const event = new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true, cancelable: true });
  input.dispatchEvent(event);
  return true;
};
