/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.module.rules.push({
            test: /sequelize/,
            use: 'null-loader',
        });
        config.module.exprContextCritical = false; // Suppress the critical dependency warning
        return config;
    },
};

export default nextConfig;