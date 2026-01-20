module.exports = {
  // @ts-ignore - JSDoc types work at runtime, TypeScript checker has issues with this pattern
  webpack: (config) => {
    // Add module resolution rule for .mjs and .js files to disable fullySpecified
    // This is needed because @oicl/openbridge-webcomponents has internal imports without .js extensions
    config.module?.rules?.push({
      test: /\.m?js$/,
      resolve: {
        fullySpecified: false,
      },
    });

    // Add rule to inline fonts as base64 data URIs to comply with CSP
    config.module?.rules?.push({
      test: /\.(ttf)$/,
      type: 'asset/inline',
    });

    return config;
  },
};
