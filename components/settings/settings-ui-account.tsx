import { AppText } from '@/components/app-text'
import { AppView } from '@/components/app-view'
import { useWalletUi } from '@/components/solana/use-wallet-ui'
import { WalletUiButtonConnect } from '@/components/solana/wallet-ui-button-connect'
import { WalletUiButtonDisconnect } from '@/components/solana/wallet-ui-button-disconnect'
import { useThemeColor } from '@/hooks/use-theme-color'
import { ellipsify } from '@/utils/ellipsify'
import { StyleSheet, View } from 'react-native'

export function SettingsUiAccount() {
  const { account } = useWalletUi()
  const tintColor = useThemeColor({}, 'tint')
  const borderColor = useThemeColor({}, 'border')
  const cardBackground = useThemeColor({}, 'card')

  return (
    <AppView style={styles.container}>
      <AppText type="subtitle">Account</AppText>
      {account ? (
        <View style={[styles.card, { backgroundColor: tintColor + '15', borderColor: tintColor }]}>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, { backgroundColor: '#22c55e' }]} />
            <AppText type="defaultSemiBold" style={{ color: tintColor }}>Connected</AppText>
          </View>
          <View style={styles.addressContainer}>
            <AppText style={styles.addressLabel}>Wallet Address</AppText>
            <AppText style={styles.address}>{ellipsify(account.publicKey.toString(), 8)}</AppText>
          </View>
          <WalletUiButtonDisconnect />
        </View>
      ) : (
        <View style={[styles.card, { backgroundColor: cardBackground, borderColor: borderColor }]}>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, { backgroundColor: '#94a3b8' }]} />
            <AppText style={{ opacity: 0.7 }}>Not Connected</AppText>
          </View>
          <AppText style={styles.helperText}>Connect your wallet to access all features.</AppText>
          <WalletUiButtonConnect />
        </View>
      )}
    </AppView>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  card: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  addressContainer: {
    gap: 4,
  },
  addressLabel: {
    fontSize: 12,
    opacity: 0.6,
  },
  address: {
    fontSize: 14,
    fontFamily: 'monospace',
  },
  helperText: {
    fontSize: 14,
    opacity: 0.7,
  },
})
