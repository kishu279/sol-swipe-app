import 'react-native-get-random-values'
import { install } from 'react-native-quick-crypto'

// Install react-native-quick-crypto polyfill
// This provides crypto.subtle (including importKey) for React Native
install()