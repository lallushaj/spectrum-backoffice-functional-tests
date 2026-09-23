module.exports = {
  default: {
    requireModule: ['tsx/cjs'],
    require: ['src/support/**/*.ts', 'src/hooks/**/*.ts', 'src/steps/**/*.ts'],
    format: ['progress', 'json:reports/cucumber-report.json'],
    formatOptions: { snippetInterface: 'async-await' },
    publishQuiet: true,
    parallel: 1,
    timeout: 120000
  }
};
