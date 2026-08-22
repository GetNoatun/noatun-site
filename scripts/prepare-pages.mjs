import { mkdir, readFile, writeFile } from 'node:fs/promises'

const indexPath = new URL('../dist/index.html', import.meta.url)
const homepage = await readFile(indexPath, 'utf8')
const enterprise = homepage
  .replace('<title>Noatun — Your own Drive and Photos</title>', '<title>Noatun for Teams — Private file workspace</title>')
  .replace('content="Noatun is a self-hosted private cloud for files, photos, documents, search, and sharing — all on infrastructure you control."', 'content="Noatun gives small teams a private file workspace with identity, quotas, sharing, monitoring, and backups on infrastructure they control."')
  .replace('content="Noatun — Your own Drive and Photos"', 'content="Noatun for Teams — Private file workspace"')
  .replace('content="A self-hosted private cloud for files, photos, documents, search, and sharing."', 'content="A focused private file workspace for small teams, with visible administration and self-hosted deployment."')
  .replaceAll('https://getnoatun.github.io/noatun-site/"', 'https://getnoatun.github.io/noatun-site/enterprise/"')

await mkdir(new URL('../dist/enterprise/', import.meta.url), { recursive: true })
await writeFile(new URL('../dist/404.html', import.meta.url), homepage)
await writeFile(new URL('../dist/enterprise/index.html', import.meta.url), enterprise)
