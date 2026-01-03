import { useSigningKey } from '@/hooks/use-signing-key'
import { useThemeColor } from '@/hooks/use-theme-color'
import { router } from 'expo-router'
import React, { useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function KeySetupScreen() {
  const backgroundColor = useThemeColor({}, 'background')
  const textColor = useThemeColor({}, 'text')
  const tintColor = useThemeColor({}, 'tint')
  const borderColor = useThemeColor({}, 'border')

  const {
    hasKey,
    publicKey,
    saveKey,
    deleteKey,
    isValidPrivateKey,
    isSaving,
    isDeleting,
  } = useSigningKey()

  const [privateKeyInput, setPrivateKeyInput] = useState('')
  const [showPrivateKey, setShowPrivateKey] = useState(false)

  const handleSaveKey = async () => {
    if (!privateKeyInput.trim()) {
      Alert.alert('Error', 'Please enter a private key')
      return
    }

    if (!isValidPrivateKey(privateKeyInput.trim())) {
      Alert.alert(
        'Invalid Key',
        'The private key format is invalid. Please enter a valid base58-encoded Solana private key.'
      )
      return
    }

    try {
      await saveKey(privateKeyInput.trim())
      setPrivateKeyInput('')
      setShowPrivateKey(false)
      Alert.alert('Success', 'Private key saved securely!', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ])
    } catch (error) {
      Alert.alert('Error', `Failed to save key: ${error}`)
    }
  }

  const handleDeleteKey = () => {
    Alert.alert(
      'Delete Private Key',
      'Are you sure you want to delete your private key? You will need to set up a new key to make swipes.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteKey()
              Alert.alert('Success', 'Private key deleted successfully')
            } catch (error) {
              Alert.alert('Error', `Failed to delete key: ${error}`)
            }
          },
        },
      ]
    )
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: textColor }]}>Signing Key Setup</Text>
          <Text style={[styles.subtitle, { color: textColor, opacity: 0.7 }]}>
            Configure your Solana private key for payment signing
          </Text>
        </View>

        {/* Warning Box */}
        <View style={[styles.warningBox, { borderColor: '#ff6b6b' }]}>
          <Text style={[styles.warningTitle, { color: '#ff6b6b' }]}>⚠️ Security Warning</Text>
          <Text style={[styles.warningText, { color: textColor }]}>
            • Never share your private key with anyone{'\n'}
            • Make sure you have a backup stored securely{'\n'}
            • This key will be encrypted and stored on your device{'\n'}• Each swipe will cost SOL
            for payment verification
          </Text>
        </View>

        {/* Current Status */}
        {hasKey && (
          <View style={[styles.statusBox, { backgroundColor: tintColor + '20', borderColor: tintColor }]}>
            <Text style={[styles.statusTitle, { color: tintColor }]}>✓ Key Configured</Text>
            {publicKey && (
              <View style={styles.publicKeyContainer}>
                <Text style={[styles.label, { color: textColor, opacity: 0.7 }]}>Public Key:</Text>
                <Text style={[styles.publicKey, { color: textColor }]} numberOfLines={1} ellipsizeMode="middle">
                  {publicKey}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Private Key Input */}
        {!hasKey && (
          <View style={styles.inputSection}>
            <Text style={[styles.label, { color: textColor }]}>Private Key (Base58)</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: backgroundColor,
                  borderColor: borderColor,
                  color: textColor,
                },
              ]}
              value={privateKeyInput}
              onChangeText={setPrivateKeyInput}
              placeholder="Enter your base58-encoded private key"
              placeholderTextColor={textColor + '50'}
              multiline
              numberOfLines={3}
              secureTextEntry={!showPrivateKey}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TouchableOpacity onPress={() => setShowPrivateKey(!showPrivateKey)} style={styles.toggleButton}>
              <Text style={[styles.toggleText, { color: tintColor }]}>
                {showPrivateKey ? '🙈 Hide' : '👁️ Show'} Private Key
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: tintColor }]}
              onPress={handleSaveKey}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.saveButtonText}>Save Private Key</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Delete Key Button */}
        {hasKey && (
          <TouchableOpacity
            style={[styles.deleteButton, { borderColor: '#ff6b6b' }]}
            onPress={handleDeleteKey}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <ActivityIndicator color="#ff6b6b" />
            ) : (
              <Text style={[styles.deleteButtonText, { color: '#ff6b6b' }]}>Delete Private Key</Text>
            )}
          </TouchableOpacity>
        )}

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={[styles.infoTitle, { color: textColor }]}>How it works</Text>
          <Text style={[styles.infoText, { color: textColor, opacity: 0.8 }]}>
            1. Your private key is encrypted and stored securely on your device{'\n'}
            2. When you swipe on profiles, a small payment is made to verify the action{'\n'}
            3. The payment is signed using your stored key{'\n'}
            4. No one else has access to your key - it never leaves your device
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  warningBox: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    lineHeight: 22,
  },
  statusBox: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  publicKeyContainer: {
    marginTop: 8,
  },
  publicKey: {
    fontSize: 12,
    fontFamily: 'monospace',
    marginTop: 4,
  },
  inputSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    fontFamily: 'monospace',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  toggleButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    marginTop: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    borderWidth: 2,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoSection: {
    marginTop: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 22,
  },
})
