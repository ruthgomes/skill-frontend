/**
 * Script de Teste de Login - Use para diagnosticar problemas
 * 
 * Como usar:
 * 1. Abra o Console do navegador (F12)
 * 2. Copie e cole este código inteiro
 * 3. Pressione Enter
 * 4. Veja os resultados
 */

async function testarLogin() {
  console.log('🔍 ===== INICIANDO DIAGNÓSTICO DE LOGIN =====\n')

  // 1. Verificar variável de ambiente
  console.log('1️⃣ Verificando URL da API...')
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
  console.log(`   URL configurada: ${apiUrl}`)
  console.log(`   URL completa: ${apiUrl}/api/v1/auth/login\n`)

  // 2. Testar conexão com backend
  console.log('2️⃣ Testando conexão com backend...')
  try {
    const healthResponse = await fetch(`${apiUrl}/api/v1`)
    console.log(`   ✅ Backend respondeu! Status: ${healthResponse.status}`)
  } catch (error) {
    console.error(`   ❌ ERRO: Backend não responde!`)
    console.error(`   Mensagem: ${error.message}`)
    console.error(`   
   🚨 PROBLEMA ENCONTRADO:
   O backend não está rodando ou a URL está incorreta!
   
   Soluções:
   - Verifique se o backend está rodando em ${apiUrl}
   - Inicie o backend com: npm run dev
   - Verifique o arquivo .env.local
    `)
    return
  }
  console.log('')

  // 3. Solicitar credenciais
  console.log('3️⃣ Digite as credenciais para teste:\n')
  const email = prompt('Digite o email:', 'admin@skillfix.com')
  const password = prompt('Digite a senha:', 'Admin@2024')

  if (!email || !password) {
    console.log('   ❌ Teste cancelado pelo usuário\n')
    return
  }

  // 4. Tentar login
  console.log('4️⃣ Tentando fazer login...')
  console.log(`   Email: ${email}`)
  console.log(`   Senha: ${'*'.repeat(password.length)}\n`)

  try {
    const loginResponse = await fetch(`${apiUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    console.log(`   Status da resposta: ${loginResponse.status}`)

    const responseData = await loginResponse.json()

    if (loginResponse.ok) {
      console.log('   ✅ LOGIN REALIZADO COM SUCESSO! 🎉\n')
      console.log('   Tokens recebidos:')
      console.log(`   - Access Token: ${responseData.accessToken.substring(0, 30)}...`)
      console.log(`   - Refresh Token: ${responseData.refreshToken.substring(0, 30)}...\n`)
      
      console.log('   🎯 PRÓXIMO PASSO:')
      console.log('   O problema pode estar no código do frontend.')
      console.log('   Verifique se o formulário de login está chamando o serviço corretamente.\n')
      
      // Tentar buscar dados do usuário
      console.log('5️⃣ Testando endpoint /auth/me...')
      const meResponse = await fetch(`${apiUrl}/api/v1/auth/me`, {
        headers: {
          'Authorization': `Bearer ${responseData.accessToken}`,
        },
      })
      
      if (meResponse.ok) {
        const userData = await meResponse.json()
        console.log('   ✅ Dados do usuário recuperados:')
        console.log(`   - Nome: ${userData.name}`)
        console.log(`   - Email: ${userData.email}`)
        console.log(`   - Role: ${userData.role}`)
        console.log(`   - Ativo: ${userData.isActive}\n`)
      }
      
    } else {
      console.error('   ❌ ERRO NO LOGIN!\n')
      console.error(`   Status: ${loginResponse.status}`)
      console.error(`   Mensagem: ${responseData.message || 'Sem mensagem'}`)
      console.error(`   Detalhes:`, responseData)
      
      if (loginResponse.status === 401) {
        console.error(`
   🚨 ERRO 401 - Não Autorizado
   
   Possíveis causas:
   1. Email ou senha incorretos
   2. Usuário não existe no banco de dados
   3. Usuário está inativo
   
   Soluções:
   - Verifique se o usuário existe no banco de dados do backend
   - Execute o seed do backend: npm run seed
   - Tente com outras credenciais
   - Use Prisma Studio para ver os usuários: npx prisma studio
        `)
      } else if (loginResponse.status === 404) {
        console.error(`
   🚨 ERRO 404 - Endpoint Não Encontrado
   
   O endpoint /api/v1/auth/login não existe no backend!
   
   Soluções:
   - Verifique se o backend tem a rota implementada
   - Verifique se a URL está correta
        `)
      }
    }
  } catch (error) {
    console.error('   ❌ ERRO DE REDE!\n')
    console.error(`   Mensagem: ${error.message}`)
    
    if (error.message.includes('CORS')) {
      console.error(`
   🚨 ERRO DE CORS
   
   O backend não está permitindo requisições do frontend!
   
   Soluções:
   - Configure CORS no backend para liberar: http://localhost:3001
   - No backend (src/main.ts ou similar), adicione:
   
   app.enableCors({
     origin: 'http://localhost:3001',
     credentials: true,
   })
      `)
    } else if (error.message.includes('Failed to fetch')) {
      console.error(`
   🚨 ERRO DE CONEXÃO
   
   Não foi possível conectar ao backend!
   
   Soluções:
   - Verifique se o backend está rodando
   - Inicie o backend com: npm run dev
   - Verifique se a porta está correta (${apiUrl})
      `)
    }
  }

  console.log('\n🔍 ===== DIAGNÓSTICO CONCLUÍDO =====')
  console.log('\nSe ainda tiver problemas, copie TODA esta saída e envie para o suporte.\n')
}

// Executar teste
testarLogin().catch(error => {
  console.error('Erro fatal no diagnóstico:', error)
})
