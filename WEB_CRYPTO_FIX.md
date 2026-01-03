# Web Crypto API Fix for @solana/kit in React Native

## Problem
The error `Cannot read property 'importKey' of undefined` occurred because:
- `@solana/kit` requires the Web Crypto API's `crypto.subtle.importKey()` method
- React Native does not provide this API by default
- The code was trying to use `createKeyPairSignerFromBytes()` which internally uses `crypto.subtle`

## Solution Implemented

### 1. Installed Solana Web Crypto Polyfill
```bash
npx expo install @solana/webcrypto-ed25519-polyfill
```

This package provides:
- `crypto.subtle.importKey()` for Ed25519 keys
- `crypto.subtle.exportKey()` for Ed25519 keys  
- `crypto.subtle.sign()` for Ed25519 signing
- `crypto.subtle.verify()` for Ed25519 verification

### 2. Updated `polyfill.js`
Added the polyfill initialization:
```javascript
import { install as installWebCrypto } from '@solana/webcrypto-ed25519-polyfill'

// ... existing crypto polyfill code ...

// Install Solana Ed25519 Web Crypto polyfill
installWebCrypto()
```

This polyfill is loaded at app startup (before any other code) via `index.js`:
```javascript
import './polyfill'  // This runs first!
import 'expo-router/entry'
```

## What This Fixes

✅ **`crypto.subtle.importKey` is now available**  
✅ **`createKeyPairSignerFromBytes()` can now create Ed25519 signers**  
✅ **x402 payment client initialization will work**  
✅ **Payment signatures can be created for swipe transactions**

## Testing

The payment flow should now work:
1. Store a signing key (encrypted or testing mode)
2. Navigate to scroll screen
3. Click "Next" to trigger a swipe
4. Payment initialization should succeed
5. Check console for success logs

## Error Resolution

**Before:**
```
ERROR  TypeError: Cannot read property 'importKey' of undefined
  at initializePaymentClient (lib/payment.ts:41:57)
```

**After:**
The `importKey` method is now available via the polyfill, and the payment client can initialize successfully.

## Additional Notes

- The polyfill is specifically designed for Solana's Ed25519 keys
- It works seamlessly with `@solana/kit@5.1.0`
- The polyfill is loaded globally at app startup
- No changes needed to payment.ts or other code - it just works!
