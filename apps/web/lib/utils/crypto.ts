
import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32;

const getKey = (salt: Buffer) => {
  const key = process.env.CANVAS_ENCRYPTION_KEY;
  if (!key) {
    throw new Error('CANVAS_ENCRYPTION_KEY is not set');
  }
  return crypto.pbkdf2Sync(key, salt, 100000, KEY_LENGTH, 'sha512');
};

export const encrypt = (text: string) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const salt = crypto.randomBytes(SALT_LENGTH);
  const key = getKey(salt);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  return Buffer.concat([salt, iv, tag, encrypted]).toString('hex');
};

export const decrypt = (encryptedText: string) => {
  const bData = Buffer.from(encryptedText, 'hex');

  const salt = bData.slice(0, SALT_LENGTH);
  const iv = bData.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const tag = bData.slice(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + TAG_LENGTH);
  const encrypted = bData.slice(SALT_LENGTH + IV_LENGTH + TAG_LENGTH);

  const key = getKey(salt);
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);

  return decipher.update(encrypted.toString('utf8'), 'utf8', 'utf8') + decipher.final('utf8');
};
