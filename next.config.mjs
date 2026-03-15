/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Removido ignoreBuildErrors - importante corrigir erros TS
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
  // Configurações de segurança
  reactStrictMode: true,
  poweredByHeader: false,
}

export default nextConfig
