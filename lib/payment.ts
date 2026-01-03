import { AppConfig } from "@/constants/app-config";
import { base58 } from "@scure/base";
import { createKeyPairSignerFromBytes } from "@solana/kit";
import { x402Client } from "@x402/core/client";
import { wrapFetchWithPayment } from "@x402/fetch";
import { registerExactSvmScheme } from "@x402/svm/exact/client";
import { getPrivateKey } from "./key-manager";

/**
 * Error thrown when signing key is not configured
 */
export class SigningKeyNotConfiguredError extends Error {
    constructor() {
        super("Signing key not configured. Please set up your key in Settings.");
        this.name = "SigningKeyNotConfiguredError";
    }
}

/**
 * Error thrown when payment fails
 */
export class PaymentFailedError extends Error {
    constructor(message: string) {
        super(`Payment failed: ${message}`);
        this.name = "PaymentFailedError";
    }
}

/**
 * Initialize x402 client with stored signing key
 */
async function initializePaymentClient() {
    const privateKeyBase58 = await getPrivateKey();

    console.log("[DEBUG] PRIVATE KEY ON BASE 64: ", privateKeyBase58)

    if (!privateKeyBase58) {
        throw new SigningKeyNotConfiguredError();
    }

    const svmSigner = await createKeyPairSignerFromBytes(
        base58.decode(privateKeyBase58!)
    );

    // Create x402 client and register SVM scheme
    const client = new x402Client();
    registerExactSvmScheme(client, { signer: svmSigner });

    // Wrap fetch with payment handling
    const fetchWithPayment = wrapFetchWithPayment(fetch, client);

    return { fetchWithPayment };
}

/**
 * Make a payment and fetch the next profile suggestion
 * @param publicKey - User's wallet public key
 * @returns Next profile data or null if failed
 */
export async function makeSwipeForNextSuggestion(publicKey: string) {
    try {
        const { fetchWithPayment } = await initializePaymentClient();

        const response = await fetchWithPayment(
            `${AppConfig.apiUrl}/user/next-suggestion`,
            { method: "GET" }
        );

        console.log("[DEBUG] API call succefull")

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new PaymentFailedError(
                errorData.message || `HTTP ${response.status}: ${response.statusText}`
            );
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error making swipe payment:", error);
        throw error;
    }
}
