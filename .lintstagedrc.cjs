const path = require('path')

module.exports = {
  '**/*.{js,jsx,ts,tsx,json,md}': filenames => {
    const relativeFiles = filenames
      .map(f => pathIpRelative(process.cwd(), f))
      .join(' ')

    return [
      `npx prettier --write ${relativeFiles}`
    ]
  },

  '**/*.{ts,tsx}': () => {
    return 'npx tsc --noEmit'
  },
}

function pathIpRelative(cwd, file) {
  return path.relative(cwd, file)
}