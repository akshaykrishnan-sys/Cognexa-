// Title tags and meta descriptions: /content/settings/seo.json (edited in the CMS)
import { readJSON } from './content.mjs';
export const SEO = Object.fromEntries(readJSON('settings/seo.json').pages.map(p => [p.path, [p.title, p.description]]));
