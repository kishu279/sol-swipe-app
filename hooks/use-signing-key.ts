import {
    deletePrivateKey,
    getPrivateKey,
    getPublicKeyFromStored,
    hasPrivateKey,
    isValidPrivateKey,
    savePrivateKey,
} from '@/lib/key-manager'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

/**
 * Custom hook to manage Solana signing key state
 */
export function useSigningKey() {
    const queryClient = useQueryClient()

    // Check if key exists
    const { data: hasKey, isLoading: checkingKey } = useQuery({
        queryKey: ['signing-key', 'exists'],
        queryFn: hasPrivateKey,
    })

    // Get public key
    const { data: publicKey, isLoading: loadingPublicKey } = useQuery({
        queryKey: ['signing-key', 'public'],
        queryFn: getPublicKeyFromStored,
        enabled: hasKey === true,
    })

    // Get private key (use sparingly!)
    const getKey = async () => {
        return await getPrivateKey()
    }

    // Save key mutation
    const saveKeyMutation = useMutation({
        mutationFn: async (privateKey: string) => {
            await savePrivateKey(privateKey)
        },
        onSuccess: () => {
            // Invalidate all signing key queries
            queryClient.invalidateQueries({ queryKey: ['signing-key'] })
        },
    })

    // Delete key mutation
    const deleteKeyMutation = useMutation({
        mutationFn: deletePrivateKey,
        onSuccess: () => {
            // Invalidate all signing key queries
            queryClient.invalidateQueries({ queryKey: ['signing-key'] })
        },
    })

    return {
        hasKey: hasKey ?? false,
        publicKey: publicKey ?? null,
        checkingKey,
        loadingPublicKey,
        saveKey: saveKeyMutation.mutateAsync,
        deleteKey: deleteKeyMutation.mutateAsync,
        getKey,
        isValidPrivateKey,
        isSaving: saveKeyMutation.isPending,
        isDeleting: deleteKeyMutation.isPending,
    }
}
