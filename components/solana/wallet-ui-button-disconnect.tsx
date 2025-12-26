import { BaseButton } from '@/components/solana/base-button'
import { useWalletUi } from '@/components/solana/use-wallet-ui'
import React from 'react'
import { useUserDraft } from '../state/user-details-provider'

export function WalletUiButtonDisconnect({ label = 'Disconnect' }: { label?: string }) {
  const { disconnect } = useWalletUi()
  const { reset } = useUserDraft()

  return <BaseButton label={label} onPress={async () => {
    try {
      await reset()
      disconnect()
    } catch (error) {
       console.error("Error resetting state:", error)
       disconnect() // disconnect anyway
    }
  }} />
}
