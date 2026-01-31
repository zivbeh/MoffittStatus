const path = require('path')

module.exports = {
  experimental: {
    serverActions: true
  },
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
}
