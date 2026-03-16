/**
 * ChangePasswordForm - Formulário para usuário alterar sua própria senha
 * 
 * Funcionalidades:
 * - Validação de senha atual
 * - Confirmação de nova senha
 * - Requisitos de segurança (mínimo 8 caracteres)
 * - Feedback de sucesso/erro
 * - Sugestões de senha forte
 */

'use client'

import { useState } from 'react'
import { usersService } from '@/core/services'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff, Check, Lock, AlertTriangle } from 'lucide-react'

interface ChangePasswordFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function ChangePasswordForm({
  onSuccess,
  onCancel,
}: ChangePasswordFormProps) {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Validação de força da senha
  function getPasswordStrength(password: string): number {
    let strength = 0

    if (password.length >= 8) strength += 25
    if (password.length >= 12) strength += 10
    if (/[a-z]/.test(password)) strength += 15
    if (/[A-Z]/.test(password)) strength += 15
    if (/[0-9]/.test(password)) strength += 15
    if (/[@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength += 20

    return Math.min(strength, 100)
  }

  const passwordStrength = getPasswordStrength(formData.newPassword)

  function getStrengthLabel(strength: number): string {
    if (strength < 40) return 'Fraca'
    if (strength < 60) return 'Média'
    if (strength < 80) return 'Boa'
    return 'Forte'
  }

  function getStrengthColor(strength: number): string {
    if (strength < 40) return 'bg-red-500'
    if (strength < 60) return 'bg-yellow-500'
    if (strength < 80) return 'bg-blue-500'
    return 'bg-green-500'
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    // Validações locais
    if (formData.newPassword.length < 8) {
      setError('A nova senha deve ter no mínimo 8 caracteres')
      setLoading(false)
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('As senhas não conferem')
      setLoading(false)
      return
    }

    if (formData.currentPassword === formData.newPassword) {
      setError('A nova senha deve ser diferente da senha atual')
      setLoading(false)
      return
    }

    try {
      await usersService.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      })

      console.log('✅ Senha alterada com sucesso!')
      setSuccess(true)

      // Limpar formulário
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })

      if (onSuccess) {
        // Aguardar um momento para mostrar mensagem de sucesso
        setTimeout(onSuccess, 2000)
      }
    } catch (err) {
      console.error('❌ Erro ao alterar senha:', err)
      setError(err instanceof Error ? err.message : 'Erro ao alterar senha')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="border-green-500">
        <CardHeader className="bg-green-50">
          <div className="flex items-center gap-2">
            <Check className="h-6 w-6 text-green-600" />
            <div>
              <CardTitle className="text-green-900">
                ✅ Senha Alterada com Sucesso!
              </CardTitle>
              <CardDescription className="text-green-700">
                Sua senha foi atualizada com segurança
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Alert className="bg-green-50 border-green-200">
            <AlertDescription className="text-sm text-green-800">
              <p className="font-medium mb-2">🔒 Sua conta está segura</p>
              <p>
                Lembre-se de utilizar esta nova senha em seus próximos acessos.
              </p>
            </AlertDescription>
          </Alert>
          {onCancel && (
            <Button onClick={onCancel} className="w-full mt-4">
              Fechar
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5" />
          <div>
            <CardTitle>Alterar Senha</CardTitle>
            <CardDescription>
              Altere sua senha de acesso ao sistema
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Senha Atual */}
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Senha Atual *</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrentPassword ? 'text' : 'password'}
                value={formData.currentPassword}
                onChange={(e) =>
                  setFormData({ ...formData, currentPassword: e.target.value })
                }
                placeholder="Digite sua senha atual"
                required
                disabled={loading}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Nova Senha */}
          <div className="space-y-2">
            <Label htmlFor="newPassword">Nova Senha *</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData({ ...formData, newPassword: e.target.value })
                }
                placeholder="Mínimo 8 caracteres"
                minLength={8}
                required
                disabled={loading}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Indicador de força da senha */}
            {formData.newPassword && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Força da senha:</span>
                  <span
                    className={`font-medium ${
                      passwordStrength < 40
                        ? 'text-red-600'
                        : passwordStrength < 60
                        ? 'text-yellow-600'
                        : passwordStrength < 80
                        ? 'text-blue-600'
                        : 'text-green-600'
                    }`}
                  >
                    {getStrengthLabel(passwordStrength)}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${getStrengthColor(passwordStrength)}`}
                    style={{ width: `${passwordStrength}%` }}
                  />
                </div>
              </div>
            )}

            {/* Requisitos da senha */}
            <div className="bg-gray-50 p-3 rounded-lg text-sm space-y-1">
              <p className="font-medium text-gray-700 mb-2">
                Requisitos da senha:
              </p>
              <div className="space-y-1 text-gray-600">
                <div
                  className={
                    formData.newPassword.length >= 8
                      ? 'text-green-600'
                      : 'text-gray-500'
                  }
                >
                  {formData.newPassword.length >= 8 ? '✅' : '○'} Mínimo 8
                  caracteres
                </div>
                <div
                  className={
                    /[A-Z]/.test(formData.newPassword)
                      ? 'text-green-600'
                      : 'text-gray-500'
                  }
                >
                  {/[A-Z]/.test(formData.newPassword) ? '✅' : '○'} Letra
                  maiúscula
                </div>
                <div
                  className={
                    /[a-z]/.test(formData.newPassword)
                      ? 'text-green-600'
                      : 'text-gray-500'
                  }
                >
                  {/[a-z]/.test(formData.newPassword) ? '✅' : '○'} Letra
                  minúscula
                </div>
                <div
                  className={
                    /[0-9]/.test(formData.newPassword)
                      ? 'text-green-600'
                      : 'text-gray-500'
                  }
                >
                  {/[0-9]/.test(formData.newPassword) ? '✅' : '○'} Número
                </div>
                <div
                  className={
                    /[@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
                      formData.newPassword
                    )
                      ? 'text-green-600'
                      : 'text-gray-500'
                  }
                >
                  {/[@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
                    formData.newPassword
                  )
                    ? '✅'
                    : '○'}{' '}
                  Caractere especial (@, #, $, etc)
                </div>
              </div>
            </div>
          </div>

          {/* Confirmar Nova Senha */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Nova Senha *</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                placeholder="Digite novamente a nova senha"
                minLength={8}
                required
                disabled={loading}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {formData.confirmPassword &&
              formData.newPassword !== formData.confirmPassword && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  As senhas não conferem
                </p>
              )}
            {formData.confirmPassword &&
              formData.newPassword === formData.confirmPassword && (
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  As senhas conferem
                </p>
              )}
          </div>

          {/* Mensagem de erro */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>❌ {error}</AlertDescription>
            </Alert>
          )}

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
                className="flex-1"
              >
                Cancelar
              </Button>
            )}
            <Button
              type="submit"
              disabled={
                loading ||
                formData.newPassword !== formData.confirmPassword ||
                formData.newPassword.length < 8
              }
              className="flex-1"
            >
              {loading ? '⏳ Alterando...' : '🔒 Alterar Senha'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
