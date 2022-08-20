// craco.config.js
module.exports = {
    style: {
        postcss: {
            plugins: [
                require('tailwindcss'),
                require('autoprefixer'),
            ],
        },
    },
    // webpack: {
    //     configure: (config, { env, paths }) => {
    //         config.module.rules.push({
    //             test: /\.svg$/,
    //             use: ["@svgr/webpack"]
    //         });
    //         return config;
    //     }
    // }
}
