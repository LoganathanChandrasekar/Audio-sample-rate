/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * Validate password strength
 */
export const isStrongPassword = (password) => {
  return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password);
};

/**
 * Validate file name (no special chars except - _ .)
 */
export const isValidFileName = (name) => {
  return /^[a-zA-Z0-9_\-\s.]+$/.test(name) && name.length <= 200;
};
