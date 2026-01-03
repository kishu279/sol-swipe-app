import { useSigningKey } from '@/hooks/use-signing-key'
import { useThemeColor } from '@/hooks/use-theme-color'
import React, { useState } from 'react'
import {
    ActivityIndicator,
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'

export function SettingsSigningKey() {
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
  const [showTermsModal, setShowTermsModal] = useState(false)

  const handleInitiateSave = () => {
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

    // Show terms and conditions modal
    setShowTermsModal(true)
  }

  const handleAcceptTermsAndSave = async () => {
    setShowTermsModal(false)

    try {
      await saveKey(privateKeyInput.trim())
      setPrivateKeyInput('')
      setShowPrivateKey(false)
      Alert.alert('Success', 'Private key saved securely! You can now swipe on profiles.')
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
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: textColor }]}>Signing Key</Text>

      {/* Current Status */}
      {hasKey ? (
        <View style={[styles.statusBox, { backgroundColor: tintColor + '20', borderColor: tintColor }]}>
          <View style={styles.statusHeader}>
            <Text style={[styles.statusTitle, { color: tintColor }]}>✓ Key Configured</Text>
            <TouchableOpacity onPress={handleDeleteKey} disabled={isDeleting}>
              {isDeleting ? (
                <ActivityIndicator size="small" color="#ff6b6b" />
              ) : (
                <Text style={[styles.deleteText, { color: '#ff6b6b' }]}>Delete</Text>
              )}
            </TouchableOpacity>
          </View>
          {publicKey && (
            <View style={styles.publicKeyContainer}>
              <Text style={[styles.label, { color: textColor, opacity: 0.7 }]}>Public Key:</Text>
              <Text style={[styles.publicKey, { color: textColor }]} numberOfLines={1} ellipsizeMode="middle">
                {publicKey}
              </Text>
            </View>
          )}
          <Text style={[styles.helperText, { color: textColor, opacity: 0.6 }]}>
            🔒 Encrypted and stored securely on your device
          </Text>
        </View>
      ) : (
        <View style={[styles.inputBox, { borderColor: borderColor }]}>
          <Text style={[styles.label, { color: textColor }]}>Private Key (Base58)</Text>
          <Text style={[styles.helperText, { color: textColor, opacity: 0.6 }]}>
            Required for swipe payment verification
          </Text>

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
            numberOfLines={2}
            secureTextEntry={!showPrivateKey}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <View style={styles.actionRow}>
            <TouchableOpacity onPress={() => setShowPrivateKey(!showPrivateKey)}>
              <Text style={[styles.toggleText, { color: tintColor }]}>
                {showPrivateKey ? '🙈 Hide' : '👁️ Show'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: tintColor }]}
              onPress={handleInitiateSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.saveButtonText}>Save Key</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Terms and Conditions Modal */}
      <Modal
        visible={showTermsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowTermsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: backgroundColor }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[styles.modalTitle, { color: textColor }]}>Terms & Security</Text>

              {/* Security Information */}
              <View style={[styles.securityBox, { borderColor: tintColor }]}>
                <Text style={[styles.securityTitle, { color: tintColor }]}>🔒 Your Key is Secure</Text>
                <Text style={[styles.securityText, { color: textColor }]}>
                  We use industry-standard encryption to protect your private key:
                </Text>
                <View style={styles.bulletList}>
                  <Text style={[styles.bulletText, { color: textColor }]}>
                    • XOR encryption with a unique device key
                  </Text>
                  <Text style={[styles.bulletText, { color: textColor }]}>
                    • Stored locally using encrypted AsyncStorage
                  </Text>
                  <Text style={[styles.bulletText, { color: textColor }]}>
                    • Never transmitted to external servers
                  </Text>
                  <Text style={[styles.bulletText, { color: textColor }]}>
                    • Only decrypted when signing transactions
                  </Text>
                </View>
              </View>

              {/* Terms */}
              <View style={styles.termsSection}>
                <Text style={[styles.termsTitle, { color: textColor }]}>Terms & Conditions</Text>
                <Text style={[styles.termsText, { color: textColor, opacity: 0.8 }]}>
                  By saving your private key, you agree to:
                  {'\n\n'}
                  1. You are solely responsible for the security of your private key
                  {'\n\n'}
                  2. Each swipe action will incur a small SOL payment for verification
                  {'\n\n'}
                  3. You understand that lost keys cannot be recovered by us
                  {'\n\n'}
                  4. You have a secure backup of your private key stored elsewhere
                  {'\n\n'}
                  5. You will never share your private key with anyone
                </Text>
              </View>

              {/* Warning */}
              <View style={[styles.warningBox, { borderColor: '#ff6b6b' }]}>
                <Text style={[styles.warningTitle, { color: '#ff6b6b' }]}>⚠️ Important</Text>
                <Text style={[styles.warningText, { color: textColor }]}>
                  Never share your private key. We will never ask for it. Make sure you have a backup.
                </Text>
              </View>
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton, { borderColor: borderColor }]}
                onPress={() => setShowTermsModal(false)}
              >
                <Text style={[styles.cancelButtonText, { color: textColor }]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.acceptButton, { backgroundColor: tintColor }]}
                onPress={handleAcceptTermsAndSave}
              >
                <Text style={styles.acceptButtonText}>Accept & Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  statusBox: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteText: {
    fontSize: 14,
    fontWeight: '600',
  },
  publicKeyContainer: {
    marginTop: 8,
    marginBottom: 8,
  },
  publicKey: {
    fontSize: 11,
    fontFamily: 'monospace',
    marginTop: 4,
  },
  inputBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  helperText: {
    fontSize: 12,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 13,
    fontFamily: 'monospace',
    minHeight: 60,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '600',
  },
  saveButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxHeight: '85%',
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  securityBox: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  securityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  securityText: {
    fontSize: 14,
    marginBottom: 12,
  },
  bulletList: {
    marginLeft: 8,
  },
  bulletText: {
    fontSize: 13,
    lineHeight: 22,
  },
  termsSection: {
    marginBottom: 20,
  },
  termsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  termsText: {
    fontSize: 13,
    lineHeight: 20,
  },
  warningBox: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 13,
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 2,
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  acceptButton: {
    // backgroundColor set via tintColor
  },
  acceptButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
})
