module.exports = {
    apps : [{
      script: 'build/index.js',
      watch: 'build',
      env: {
        NODE_ENV: 'production',
        HOST: '0.0.0.0',
        PORT: '30300'
      }, 
      env_development:{
        NODE_ENV: 'development',
        HOST: '0.0.0.0',
        PORT: '20300'
      }
    }]
  };