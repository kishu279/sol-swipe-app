import { install as installWebCrypto } from '@solana/webcrypto-ed25519-polyfill'
import { Buffer } from 'buffer'
import { getRandomValues as expoCryptoGetRandomValues } from 'expo-crypto'

global.Buffer = Buffer

// getRandomValues polyfill
class Crypto {
  getRandomValues = expoCryptoGetRandomValues
}

const webCrypto = typeof crypto !== 'undefined' ? crypto : new Crypto()

;(() => {
  if (typeof crypto === 'undefined') {
    Object.defineProperty(window, 'crypto', {
      configurable: true,
      enumerable: true,
      get: () => webCrypto,
    })
  }
})()

// Install Solana Ed25519 Web Crypto polyfill
// This adds support for crypto.subtle.importKey, exportKey, sign, verify for Ed25519
installWebCrypto()

