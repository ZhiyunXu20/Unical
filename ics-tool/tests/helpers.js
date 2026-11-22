import { readFileSync } from 'node:fs'
export const loadDoc = (path) =>
  new DOMParser().parseFromString(readFileSync(new URL(path, import.meta.url), 'utf8'), 'text/html')
