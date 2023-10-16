/** @type {import('next').NextConfig} */
const repo = 'hygraph-apps'
const assetPrefix = `/${repo}/`
const basePath = `/${repo}`

const nextConfig = {
    exportTrailingSlash: true,
    assetPrefix: assetPrefix,
    basePath: basePath,
}

module.exports = nextConfig
