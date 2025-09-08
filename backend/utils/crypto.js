import crypto from 'crypto';
import { env } from '../config/env.js';


const KEY = Buffer.from(env.cryptoKey, 'hex'); // 32 bytes
const NONCE_SALT = Buffer.from(env.cryptoIvSalt, 'hex');


function nonceFor(id) {
// Per-document nonce derivation (deterministic) – prevents IV reuse; 12 bytes for GCM
// DO NOT reuse nonce+key pair.
const h = crypto.createHash('sha256').update(String(id)).update(NONCE_SALT).digest();
return h.subarray(0, 12);
}


export function encryptField(plain, idForNonce) {
if (plain == null) return null;
const iv = nonceFor(idForNonce || crypto.randomUUID());
const cipher = crypto.createCipheriv('aes-256-gcm', KEY, iv);
const enc = Buffer.concat([cipher.update(String(plain), 'utf8'), cipher.final()]);
const tag = cipher.getAuthTag();
return Buffer.concat([iv, tag, enc]).toString('base64');
}


export function decryptField(payload) {
if (!payload) return null;
const buf = Buffer.from(payload, 'base64');
const iv = buf.subarray(0, 12);
const tag = buf.subarray(12, 28);
const data = buf.subarray(28);
const decipher = crypto.createDecipheriv('aes-256-gcm', KEY, iv);
decipher.setAuthTag(tag);
const dec = Buffer.concat([decipher.update(data), decipher.final()]);
return dec.toString('utf8');
}