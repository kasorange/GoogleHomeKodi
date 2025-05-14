export default {
  presets: [
    ['@babel/preset-env', {
      targets: {
        node: 'current'
      },
      useBuiltIns: 'usage',
      corejs: 2,
      modules: false
    }]
  ],
  plugins: [
    ['@babel/plugin-transform-runtime', {
      corejs: 2,
      regenerator: true,
      useESModules: true
    }]
  ]
}; 