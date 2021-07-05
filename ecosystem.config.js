module.exports = {
  apps: [
    {
      name: 'u3t',
      script: './build/index.js',
      cwd: './server/',
      env: {
        NODE_ENV: 'production',
        DOTENV_CONFIG_PATH: '../../u3t-configs/.env-server'
      },
      node_args: '-r dotenv/config',
    },
  ],
};
