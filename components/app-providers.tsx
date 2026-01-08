import { AppTheme } from '@/components/app-theme'
import { AuthProvider } from '@/components/auth/auth-provider'
import { SolanaProvider } from '@/components/solana/solana-provider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PropsWithChildren } from 'react'
import { ClusterProvider } from './cluster/cluster-provider'
import { ScrollDataProvider } from './state/scroll-data-provider'
import { UserDraftProvider } from './state/user-details-provider'

const queryClient = new QueryClient()

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <AppTheme>
      <QueryClientProvider client={queryClient}>
        <ClusterProvider>
          <SolanaProvider>
            {/* AUTH STATE */}
            <AuthProvider>
              {/* USER STATE */}
              <UserDraftProvider>
                {/* SCROLL DATA STATE */}
                <ScrollDataProvider>{children}</ScrollDataProvider>
              </UserDraftProvider>
            </AuthProvider>
          </SolanaProvider>
        </ClusterProvider>
      </QueryClientProvider>
    </AppTheme>
  )
}
