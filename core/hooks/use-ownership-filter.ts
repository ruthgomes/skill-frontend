/**
 * Hook para filtrar dados baseado no ownership do usuário
 * Regras:
 * - Admin (sem tecnicoId): vê todos os dados
 * - Supervisor (com tecnicoId): vê apenas dados que ele criou
 */

import { useAuth } from "@/core/contexts";
import { useMemo } from "react";

export function useOwnershipFilter() {
    const { isAdmin, user } = useAuth();
    const userId = user?.id

    /**
     * Verifica se o usuário pode editar um item específico
     * Regra: Admin pode tudo, Supervisor só pode editar o que criou
     */
    const canEdit = useMemo(() => {
        return <T extends { createdById?: string | null }>(item: T): boolean => {
            if (isAdmin) return true
            if (!userId) return false
            return item.createdById === userId
        }
    }, [isAdmin, userId])

    /**
     * Verifica se o usuário pode deletar um item específico
     * Regra: Mesma regra do canEdit
     */
    const canDelete = useMemo(() => {
        return <T extends { createdById?: string | null }>(item: T): boolean => {
            if (isAdmin) return true
            if (!userId) return false
            return item.createdById === userId
        }
    }, [isAdmin, userId])

    /**
     * Filtra uma lista de itens para mostrar apenas os que usuário têm acesso
     */
    const filterOwned = useMemo(() => {
        return <T extends { createdById?: string | null }>(items: T[]): T[] => {
            if (isAdmin) return items
            if (!userId) return []
            return items.filter(item => item.createdById === userId)
        }
    }, [isAdmin, userId])

    return {
        canEdit,
        canDelete,
        filterOwned,
        isAdmin,
        userId,
    }
}
