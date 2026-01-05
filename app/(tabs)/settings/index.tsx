import { SettingsSigningKey } from '@/components/settings/settings-signing-key'
import { SettingsThemeToggle } from '@/components/settings/settings-theme-toggle'
import { SettingsUiAccount } from '@/components/settings/settings-ui-account'

import { AppPage } from '@/components/app-page'

export default function TabSettingsScreen() {
  return (
    <AppPage>
      <SettingsUiAccount />
      <SettingsThemeToggle />
      <SettingsSigningKey />
    </AppPage>
  )
}

