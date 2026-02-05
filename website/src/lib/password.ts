/**
 * Password hashing utilities using Web Crypto API
 * Compatible with Cloudflare Workers/Pages edge runtime
 *
 * Uses PBKDF2 with SHA-256 which is natively supported in all edge runtimes
 */

const ITERATIONS = 100000;
const HASH_LENGTH = 32;
const SALT_LENGTH = 16;
const ALGORITHM = 'PBKDF2';
const HASH_ALGORITHM = 'SHA-256';

/**
 * Converts ArrayBuffer or Uint8Array to hex string
 */
function bufferToHex(buffer: ArrayBuffer | Uint8Array): string {
  const arr = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  return Array.from(arr)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Converts hex string to Uint8Array
 */
function hexToBuffer(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

/**
 * Generates a random salt
 */
function generateSalt(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
}

/**
 * Derives a key from password using PBKDF2
 */
async function deriveKey(
  password: string,
  salt: Uint8Array
): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    ALGORITHM,
    false,
    ['deriveBits']
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: ALGORITHM,
      salt: salt.buffer as ArrayBuffer,
      iterations: ITERATIONS,
      hash: HASH_ALGORITHM,
    },
    keyMaterial,
    HASH_LENGTH * 8
  );

  return derivedBits;
}

/**
 * Hashes a password using PBKDF2
 * Returns a string in format: $pbkdf2$iterations$salt$hash
 *
 * @param password - Plain text password to hash
 * @returns Hashed password string
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = generateSalt();
  const hash = await deriveKey(password, salt);

  const saltHex = bufferToHex(salt);
  const hashHex = bufferToHex(hash);

  // Format: $pbkdf2$iterations$salt$hash
  return `$pbkdf2$${ITERATIONS}$${saltHex}$${hashHex}`;
}

/**
 * Verifies a password against a hash
 *
 * @param hash - Stored password hash (from hashPassword)
 * @param password - Plain text password to verify
 * @returns true if password matches, false otherwise
 */
export async function verifyPassword(
  hash: string,
  password: string
): Promise<boolean> {
  try {
    // Parse the hash format: $pbkdf2$iterations$salt$hash
    const parts = hash.split('$');

    // Check format
    if (parts.length !== 5 || parts[1] !== 'pbkdf2') {
      // Try legacy argon2 format detection
      if (hash.startsWith('$argon2')) {
        console.warn(
          'Legacy argon2 hash detected. Please re-hash password with new algorithm.'
        );
        return false;
      }
      console.error('Invalid hash format');
      return false;
    }

    const iterations = parseInt(parts[2], 10);
    const saltHex = parts[3];
    const storedHashHex = parts[4];

    const salt = hexToBuffer(saltHex);

    // Derive key with same parameters
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);

    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      passwordBuffer,
      ALGORITHM,
      false,
      ['deriveBits']
    );

    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: ALGORITHM,
        salt: salt.buffer as ArrayBuffer,
        iterations: iterations,
        hash: HASH_ALGORITHM,
      },
      keyMaterial,
      HASH_LENGTH * 8
    );

    const derivedHashHex = bufferToHex(derivedBits);

    // Constant-time comparison to prevent timing attacks
    if (derivedHashHex.length !== storedHashHex.length) {
      return false;
    }

    let result = 0;
    for (let i = 0; i < derivedHashHex.length; i++) {
      result |= derivedHashHex.charCodeAt(i) ^ storedHashHex.charCodeAt(i);
    }

    return result === 0;
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
}
