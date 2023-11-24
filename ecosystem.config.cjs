module.exports = {
	apps: [
		{
			script: 'build/index.js',
			append_env_to_name: true,
			watch: 'build',
			env: {
				NODE_ENV: 'production',
				HOST: '0.0.0.0',
				PORT: '30300'
			},
			env_development: {
				NODE_ENV: 'development',
				HOST: '0.0.0.0',
				PORT: '20300'
			}
		}
	]
};
