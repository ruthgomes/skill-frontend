/**
 * CreateUserForm - Formulário de criação de usuário com gerenciamento de senha automática
 * 
 * Funcionalidades:
 * - Permite criar usuário COM senha manual ou SEM senha (backend gera automaticamente)
 * - Exibe a senha temporária retornada pelo backend
 * - Permite copiar a senha para área de transferência
 * - Alerta para compartilhar a senha com o novo usuário
 */

'use client'

import { useState } from 'react'
import { usersService } from '@/core/services'
import type { UserRole, Workday, User } from '@/core/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Copy, Check, AlertTriangle, User as UserIcon } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'

interface CreateUserFormProps {
  onSuccess?: (user: User) => void
  onCancel?: () => void
}

export function CreateUserForm({ onSuccess, onCancel }: CreateUserFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'supervisor' as UserRole,
    workday: 'diurno' as Workday,
  })

  const [useAutoPassword, setUseAutoPassword] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [createdUser, setCreatedUser] = useState<User | null>(null)
  const [copied, setCopied] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Se usar senha automática, não enviar o campo password
      const payload = useAutoPassword
        ? {
            name: formData.name,
            email: formData.email,
            role: formData.role,
            workday: formData.workday,
          }
        : formData

      const user = await usersService.create(payload)

      console.log('✅ Usuário criado com sucesso!')
      console.log('📧 Email:', user.email)
      console.log('👤 Nome:', user.name)
      console.log('🔑 Role:', user.role)

      if (user.temporaryPassword) {
        console.log('🔐 Senha Temporária:', user.temporaryPassword)
      }

      setCreatedUser(user)

      if (onSuccess) {
        onSuccess(user)
      }
    } catch (err) {
      console.error('❌ Erro ao criar usuário:', err)
      setError(err instanceof Error ? err.message : 'Erro ao criar usuário')
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

  function resetForm() {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'supervisor' as UserRole,
      workday: 'diurno' as Workday,
    })
    setCreatedUser(null)
    setError('')
    setCopied(false)
  }

  // Se o usuário foi criado com senha temporária, mostrar o card de credenciais
  if (createdUser?.temporaryPassword) {
    return (
      <Card className="border-yellow-500">
        <CardHeader className="bg-yellow-50">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-yellow-600" />
            <div>
              <CardTitle className="text-yellow-900">
                ⚠️ Usuário Criado - Anote as Credenciais!
              </CardTitle>
              <CardDescription className="text-yellow-700">
                Esta senha temporária será exibida APENAS UMA VEZ
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          {/* Informações do usuário */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div>
              <Label className="text-gray-600 text-sm">Nome</Label>
              <p className="font-medium">{createdUser.name}</p>
            </div>
            <div>
              <Label className="text-gray-600 text-sm">Email</Label>
              <p className="font-medium">{createdUser.email}</p>
            </div>
            <div>
              <Label className="text-gray-600 text-sm">Perfil</Label>
              <p className="font-medium capitalize">{createdUser.role}</p>
            </div>
          </div>

          {/* Senha temporária - DESTAQUE */}
          <div className="bg-yellow-100 border-2 border-yellow-400 p-4 rounded-lg">
            <Label className="text-yellow-900 font-bold mb-2 block">
              🔐 Senha Temporária
            </Label>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-white px-4 py-3 rounded border border-yellow-300 text-lg font-mono font-bold text-gray-900">
                {createdUser.temporaryPassword}
              </code>
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(createdUser.temporaryPassword!)}
                className="h-11 w-11"
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
            <AlertDescription className="space-y-2 text-sm">
              <p className="font-bold">📋 Próximos Passos:</p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Copie a senha temporária acima</li>
                <li>Compartilhe com o usuário através de um canal seguro</li>
                <li>Instrua o usuário a <strong>trocar a senha no primeiro acesso</strong></li>
                <li>Após anotar, clique em "Concluir"</li>
              </ol>
            </AlertDescription>
          </Alert>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={resetForm}
              variant="outline"
              className="flex-1"
            >
              <UserIcon className="h-4 w-4 mr-2" />
              Criar Outro Usuário
            </Button>
            <Button
              onClick={() => {
                resetForm()
                if (onCancel) onCancel()
              }}
              className="flex-1"
            >
              <Check className="h-4 w-4 mr-2" />
              Concluir
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Formulário de criação
  return (
    <Card>
      <CardHeader>
        <CardTitle>Criar Novo Usuário</CardTitle>
        <CardDescription>
          Crie um novo supervisor ou master no sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo *</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Ex: João Silva Santos"
              required
              disabled={loading}
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="joao.silva@empresa.com"
              required
              disabled={loading}
            />
          </div>

          {/* Perfil */}
          <div className="space-y-2">
            <Label htmlFor="role">Perfil *</Label>
            <Select
              value={formData.role}
              onValueChange={(value) =>
                setFormData({ ...formData, role: value as UserRole })
              }
              disabled={loading}
            >
              <SelectTrigger id="role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="supervisor">👤 Supervisor</SelectItem>
                <SelectItem value="master">👑 Master</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Turno */}
          <div className="space-y-2">
            <Label htmlFor="workday">Turno</Label>
            <Select
              value={formData.workday}
              onValueChange={(value) =>
                setFormData({ ...formData, workday: value as Workday })
              }
              disabled={loading}
            >
              <SelectTrigger id="workday">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="diurno">☀️ Diurno</SelectItem>
                <SelectItem value="noturno">🌙 Noturno</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Opção de senha automática */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="auto-password"
                checked={useAutoPassword}
                onCheckedChange={(checked) =>
                  setUseAutoPassword(checked as boolean)
                }
                disabled={loading}
              />
              <Label
                htmlFor="auto-password"
                className="text-sm font-normal cursor-pointer"
              >
                🔐 Gerar senha temporária automaticamente (recomendado)
              </Label>
            </div>

            {/* Campo de senha manual (só aparece se não usar automática) */}
            {!useAutoPassword && (
              <div className="space-y-2 pl-6">
                <Label htmlFor="password">Senha Manual *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Mínimo 8 caracteres"
                  minLength={8}
                  required={!useAutoPassword}
                  disabled={loading}
                />
                <p className="text-sm text-gray-500">
                  ⚠️ Você precisará compartilhar esta senha manualmente com o
                  usuário
                </p>
              </div>
            )}

            {useAutoPassword && (
              <Alert className="ml-6">
                <AlertDescription className="text-sm">
                  ✅ O sistema irá gerar uma senha segura de 12 caracteres
                  (letras, números e símbolos) e exibirá na tela após a criação.
                </AlertDescription>
              </Alert>
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
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? '⏳ Criando...' : '✅ Criar Usuário'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
