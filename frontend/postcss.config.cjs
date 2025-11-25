module.exports = {
  plugins: [
    require('autoprefixer'),
    // PurgeCSS via PostCSS to remove unused selectors in production builds
    ...(process.env.NODE_ENV === 'production' ? [
      require('@fullhuman/postcss-purgecss')({
        content: ['./index.html', './src/**/*.vue', './src/**/*.js'],
        defaultExtractor: content => content.match(/[^<>'"\s]*[^<>'"\s:]/g) || []
      })
    ] : []),
    require('cssnano')({ preset: 'default' })
  ]
}
