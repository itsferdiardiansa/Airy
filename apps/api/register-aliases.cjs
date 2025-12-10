const path = require('path');
const moduleAlias = require('module-alias');

const isProd = process.env.NODE_ENV === 'production';
const base = isProd ? path.join(__dirname, 'dist') : path.join(__dirname, 'src');

moduleAlias.addAliases({
  '@': base,
  '@/': base + '/',
});
