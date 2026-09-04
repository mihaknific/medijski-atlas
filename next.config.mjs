/** @type {import('next').NextConfig} */
const isStaticExport = process.env.NEXT_EXPORT === 'true' || process.env.GITHUB_ACTIONS === 'true'
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  ...(isStaticExport ? { output: 'export' } : {}),
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
}

export default nextConfig
