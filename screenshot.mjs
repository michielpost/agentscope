import { chromium } from 'playwright'

const BASE = 'https://dashboard-three-smoky-78.vercel.app'

const pages = [
  { path: '/overview',       file: 'overview.png',       title: 'Overview' },
  { path: '/activity',       file: 'activity.png',       title: 'Activity' },
  { path: '/celo',           file: 'celo.png',           title: 'Celo' },
  { path: '/uniswap',        file: 'uniswap.png',        title: 'Uniswap' },
  { path: '/octant',         file: 'octant.png',         title: 'Octant' },
  { path: '/agent-identity', file: 'agent-identity.png', title: 'Agent Identity' },
]

const browser = await chromium.launch()
const context = await browser.newContext({
  viewport: { width: 1400, height: 900 },
  colorScheme: 'dark',
})

for (const { path, file, title } of pages) {
  const page = await context.newPage()
  console.log(`Capturing ${title}…`)
  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle', timeout: 30000 })
  await page.waitForTimeout(2000) // let charts render
  await page.screenshot({ path: `public/screenshots/${file}`, fullPage: false })
  await page.close()
  console.log(`  ✓ saved public/screenshots/${file}`)
}

await browser.close()
console.log('\nAll screenshots captured.')
