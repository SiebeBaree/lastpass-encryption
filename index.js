import argon2 from "argon2";
import crypto from "node:crypto";
import LocalStorageMock from "./localStorageMock.js";
import ServerMock from "./server.js";
import { passwordSchema } from "./passwordSchema.js";

const localStorage = new LocalStorageMock();
const server = new ServerMock();

const email = "siebe.baree@outlook.com";
const password = "S0meR@nd0mP@ssw0rd!";
const hashedPassword = await argon2.hash(password);
const salt = getHash(email);
const encryptionMethod = "aes-256-cbc";

localStorage.setItem("salt", salt);

const passwordData = passwordSchema.safeParse(password);
if (!passwordData.success) {
    JSON.parse(passwordData.error.message).forEach((element) => {
        console.error(element.message);
    });
    process.exit(1);
}

function getHash(value) {
    return crypto.createHash("sha256").update(value).digest("hex");
}

async function getPBKDF2Key(password, salt, iterations, keyLength) {
    const now = Date.now();
    const key = await new Promise((resolve, reject) => {
        crypto.pbkdf2(password, salt, iterations, keyLength, "sha256", (err, derivedKey) => {
            if (err) reject(err);
            else resolve(derivedKey);
        });
    });
    console.log(`Time to generate key (${iterations} rounds): ${Date.now() - now}ms`);
    return key;
}

function encryptData(method, key, iv, message) {
    const cipher = crypto.createCipheriv(method, Buffer.from(key, "hex"), Buffer.from(iv, "hex"));
    let encrypted = cipher.update(message, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
}

// Register (Create PBKDF2 key) [600000 rounds takes about 270ms on a MacBook Pro M1]
const key = await getPBKDF2Key(passwordData.data, salt, 600000, 32);
console.log(`Key: ${key.toString("hex")}`);

localStorage.setItem("private_key", key.toString("hex"));

// Encrypt data
const iv = crypto.randomBytes(16);
localStorage.setItem("iv", iv.toString("hex"));

const encrypted = encryptData(
    encryptionMethod,
    localStorage.getItem("private_key"),
    localStorage.getItem("iv"),
    "Hello, World!",
);
console.log(`Encrypted: ${encrypted}`);

// Generate auth hash
const authHashKey = await getPBKDF2Key(localStorage.getItem("private_key"), salt, 1, 32);
const scryptSalt = crypto.randomBytes(16);
const loginHash = await new Promise((resolve, reject) => {
    crypto.scrypt(authHashKey.toString("hex"), scryptSalt, 32, { N: 16384 }, (err, derivedKey) => {
        if (err) reject(err);
        else resolve(derivedKey.toString("hex"));
    });
});
console.log(`Login Hash: ${loginHash}`);

// Server: auth
await server.login(loginHash);

// Client: decrypting the data
if (await server.authenticate(loginHash)) {
    const decipher = crypto.createDecipheriv(encryptionMethod, key, iv);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    console.log(`Decrypted: ${decrypted}`);
} else {
    console.log("Authentication failed.");
}
