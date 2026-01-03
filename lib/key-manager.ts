import AsyncStorage from '@react-native-async-storage/async-storage'
import { base58 } from '@scure/base'
import * as Crypto from 'expo-crypto'

const STORAGE_KEY = 'solana_private_key'
const ENCRYPTION_KEY_STORAGE = 'encryption_key'

/**
 * Generate a random encryption key for AES encryption
 */
async function getOrCreateEncryptionKey(): Promise<string> {
    try {
        let encryptionKey = await AsyncStorage.getItem(ENCRYPTION_KEY_STORAGE)

        if (!encryptionKey) {
            // Generate a random 256-bit key
            const randomBytes = await Crypto.getRandomBytesAsync(32)
            encryptionKey = Array.from(randomBytes)
                .map((b) => b.toString(16).padStart(2, '0'))
                .join('')
            await AsyncStorage.setItem(ENCRYPTION_KEY_STORAGE, encryptionKey)
        }

        return encryptionKey
    } catch (error) {
        console.error('Error getting/creating encryption key:', error)
        throw new Error('Failed to initialize encryption')
    }
}

/**
 * Simple XOR encryption for demo purposes
 * Note: For production, consider using expo-secure-store or more robust encryption
 */
function encryptData(data: string, key: string): string {
    const result: number[] = []
    for (let i = 0; i < data.length; i++) {
        const charCode = data.charCodeAt(i)
        const keyChar = key.charCodeAt(i % key.length)
        result.push(charCode ^ keyChar)
    }
    return Buffer.from(result).toString('base64')
}

/**
 * Simple XOR decryption
 */
function decryptData(encryptedData: string, key: string): string {
    const buffer = Buffer.from(encryptedData, 'base64')
    const result: string[] = []
    for (let i = 0; i < buffer.length; i++) {
        const charCode = buffer[i]
        const keyChar = key.charCodeAt(i % key.length)
        result.push(String.fromCharCode(charCode ^ keyChar))
    }
    return result.join('')
}

/**
 * Validate if a string is a valid base58 encoded Solana private key
 */
export function isValidPrivateKey(privateKey: string): boolean {
    try {
        const decoded = base58.decode(privateKey)
        // Solana private keys are 64 bytes (when including public key) or 32 bytes
        return decoded.length === 64 || decoded.length === 32
    } catch {
        return false
    }
}

/**
 * Save private key to encrypted storage
 */
export async function savePrivateKey(privateKey: string): Promise<void> {
    try {
        if (!isValidPrivateKey(privateKey)) {
            throw new Error('Invalid private key format')
        }

        const encryptionKey = await getOrCreateEncryptionKey()
        const encrypted = encryptData(privateKey, encryptionKey)
        await AsyncStorage.setItem(STORAGE_KEY, encrypted)
    } catch (error) {
        console.error('Error saving private key:', error)
        throw error
    }
}

/**
 * Retrieve and decrypt private key from storage
 */
export async function getPrivateKey(): Promise<string | null> {
    try {
        const encrypted = await AsyncStorage.getItem(STORAGE_KEY)

        if (!encrypted) {
            return null
        }

        const encryptionKey = await getOrCreateEncryptionKey()
        const decrypted = decryptData(encrypted, encryptionKey)

        return decrypted
    } catch (error) {
        console.error('Error retrieving private key:', error)
        return null
    }
}

/**
 * Delete private key from storage
 */
export async function deletePrivateKey(): Promise<void> {
    try {
        await AsyncStorage.removeItem(STORAGE_KEY)
    } catch (error) {
        console.error('Error deleting private key:', error)
        throw error
    }
}

/**
 * Check if a private key exists in storage
 */
export async function hasPrivateKey(): Promise<boolean> {
    try {
        const key = await AsyncStorage.getItem(STORAGE_KEY)
        return key !== null
    } catch (error) {
        console.error('Error checking for private key:', error)
        return false
    }
}

/**
 * Get public key from stored private key
 */
export async function getPublicKeyFromStored(): Promise<string | null> {
    try {
        const privateKey = await getPrivateKey()

        if (!privateKey) {
            return null
        }

        const privateKeyBytes = base58.decode(privateKey)

        // If it's a 64-byte keypair, the public key is the last 32 bytes
        // If it's a 32-byte seed, we'd need to derive it (requires additional crypto)
        if (privateKeyBytes.length === 64) {
            const publicKeyBytes = privateKeyBytes.slice(32, 64)
            return base58.encode(publicKeyBytes)
        }

        // For 32-byte seeds, we can't easily get the public key without additional libraries
        // Return null or implement full derivation
        return null
    } catch (error) {
        console.error('Error getting public key:', error)
        return null
    }
}
