import SecureLS from 'secure-ls';

const ls = new SecureLS();

/**
 * Set an item securely in storage.
 * @param {string} name - The key name.
 * @param {any} value - The value to store.
 */
function setItem(name: string, value: any): void {
  try {
    ls.set(name, value);
  } catch (error) {
    console.error(`Error setting item '${name}' in secure storage:`, error);
  }
}

/**
 * Get an item securely from storage.
 * @param {string} name - The key name.
 * @returns {T | null} - The value, or null if not found.
 */
function getItem<T>(name: string): T | null {
  try {
    return ls.get(name) as T;
  } catch (error) {
    console.error(`Error getting item '${name}' from secure storage:`, error);
    return null;
  }
}

/**
 * Remove an item securely from storage.
 * @param {string} name - The key name.
 */
function removeItem(name: string): void {
  try {
    ls.remove(name);
  } catch (error) {
    console.error(`Error removing item '${name}' from secure storage:`, error);
  }
}

const SecureStorage = {
  setItem,
  getItem,
  removeItem,
};

export default SecureStorage;
