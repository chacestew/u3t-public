module.exports = (api) => {
  api.cache.using(() => process.env.NODE_ENV);

  const presets = [
    '@babel/preset-typescript',
    '@babel/preset-react',
    [
      '@babel/preset-env',
      {
        bugfixes: true,
        useBuiltIns: 'usage',
        corejs: 3.15,
      },
    ],
  ];

  const plugins = [
    [
      '@babel/plugin-transform-runtime',
      {
        version: '^7.14.6',
      },
    ],
    [
      'babel-plugin-styled-components',
      {
        ...(api.env('production') && { pure: true, displayName: false, filename: false }),
      },
    ],
    !api.env('production') && 'react-refresh/babel',
  ].filter(Boolean);

  return {
    presets,
    plugins,
  };
};
