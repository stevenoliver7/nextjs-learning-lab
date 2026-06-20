import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1]

// GitHub Pages serves project pages under /<repo>/.
// Local development and non-GitHub hosts keep the root base path.
export default defineConfig({
  base: repositoryName ? `/${repositoryName}/` : '/',
  plugins: [react()],
})
