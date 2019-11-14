module.exports = (config) => {
  console.log(config)
  return {
    ...config,
    modules: [path.resolve(__dirname, './src'), ...(config.modules | [])]
  }
}