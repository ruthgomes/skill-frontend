/**
 * ResetPasswordDialog - Dialog para Master resetar senha de outro usuário
 * 
 * Funcionalidades:
 * - Apenas Masters podem usar
 * - Mostra informações do usuário
 * - Gera nova senha temporária
 * - Exibe senha para copiar
 * - Alerta para compartilhar com o usuário
 */

'use client'

import { useState } from 'react'
import { usersService } from '@/core/services'
import type { User } from '@/core/types'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Copy, Check, AlertTriangle, RefreshCw, Lock } from 'lucide-react'
import { Label } from '@/components/ui/label'

interface ResetPasswordDialogProps {
  user: User
  trigger?: React.ReactNode
  onSuccess?: () => void
}

export function ResetPasswordDialog({
  user,
  trigger,
  onSuccess,
}: ResetPasswordDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [temporaryPassword, setTemporaryPassword] = useState('')
  const [copied, setCopied] = useState(false)

  async function handleReset() {
    setLoading(true)
    setError('')
    setTemporaryPassword('')

    try {
      const response = await usersService.resetPassword({ userId: user.id })

      console.log('✅ Senha resetada com sucesso!')
      console.log('🔐 Nova senha temporária:', response.temporaryPassword)

      setTemporaryPassword(response.temporaryPassword)

      if (onSuccess) {
        onSuccess()
      }
    } catch (err) {
      console.error('❌ Erro ao resetar senha:', err)
      setError(err instanceof Error ? err.message : 'Erro ao resetar senha')
    } finally {
      setLoading(false)
    }
  }

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Erro ao copiar:', err)
    }
  }

  function handleClose() {
    setOpen(false)
    // Aguardar animação de fechamento para limpar estado
    setTimeout(() => {
      setTemporaryPassword('')
      setError('')
      setCopied(false)
    }, 300)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Resetar Senha
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Resetar Senha do Usuário
          </DialogTitle>
          <DialogDescription>
            Gere uma nova senha temporária para o usuário
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {/* Informações do Usuário */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div>
              <Label className="text-gray-600 text-sm">Nome</Label>
              <p className="font-medium">{user.name}</p>
            </div>
            <div>
              <Label className="text-gray-600 text-sm">Email</Label>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <Label className="text-gray-600 text-sm">Perfil</Label>
              <p className="font-medium capitalize">{user.role}</p>
            </div>
          </div>

          {/* Se ainda não resetou */}
          {!temporaryPassword && !error && (
            <>
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  <p className="font-medium mb-2">⚠️ Atenção</p>
                  <p>
                    Ao resetar a senha, uma nova senha temporária será gerada e
                    a senha atual do usuário será invalidada.
                  </p>
                </AlertDescription>
              </Alert>

              <Button
                onClick={handleReset}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Resetando...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Confirmar Reset de Senha
                  </>
                )}
              </Button>
            </>
          )}

          {/* Se resetou com sucesso */}
          {temporaryPassword && (
            <>
              <Alert className="bg-yellow-50 border-yellow-400">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertDescription>
                  <p className="font-bold text-yellow-900 mb-2">
                    ⚠️ Senha Resetada - Anote as Credenciais!
                  </p>
                  <p className="text-sm text-yellow-800">
                    Esta senha temporária será exibida APENAS UMA VEZ
                  </p>
                </AlertDescription>
              </Alert>

              {/* Senha temporária */}
              <div className="bg-yellow-100 border-2 border-yellow-400 p-4 rounded-lg">
                <Label className="text-yellow-900 font-bold mb-2 block">
                  🔐 Nova Senha Temporária
                </Label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-white px-4 py-3 rounded border border-yellow-300 text-lg font-mono font-bold text-gray-900">
                    {temporaryPassword}
                  </code>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(temporaryPassword)}
                    className="h-11 w-11 shrink-0"
                  >
                    {copied ? (
                      <Check className="h-5 w-5 text-green-600" />
                    ) : (
                      <Copy className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Instruções */}
              <Alert>
                <AlertDescription className="text-sm space-y-2">
                  <p className="font-bold">📋 Próximos Passos:</p>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Copie a senha temporária acima</li>
                    <li>
                      Compartilhe com <strong>{user.name}</strong> através de um
                      canal seguro
                    </li>
                    <li>
                      Instrua o usuário a <strong>trocar a senha</strong> no
                      próximo acesso
                    </li>
                  </ol>
                </AlertDescription>
              </Alert>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() =>
                    copyToClipboard(
                      `Email: ${user.email}\nSenha Temporária: ${temporaryPassword}\n\nPor favor, altere sua senha após o primeiro acesso.`
                    )
                  }
                  className="flex-1"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar Credenciais
                </Button>
                <Button onClick={handleClose} className="flex-1">
                  <Check className="h-4 w-4 mr-2" />
                  Concluir
                </Button>
              </div>
            </>
          )}

          {/* Se deu erro */}
          {error && (
            <>
              <Alert variant="destructive">
                <AlertDescription>❌ {error}</AlertDescription>
              </Alert>

              <div className="flex gap-3">
                <Button variant="outline" onClick={handleClose} className="flex-1">
                  Cancelar
                </Button>
                <Button onClick={handleReset} disabled={loading} className="flex-1">
                  Tentar Novamente
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
