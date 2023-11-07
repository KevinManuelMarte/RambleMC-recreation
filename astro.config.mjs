import { defineConfig } from 'astro/config';
import nodejs from '@astrojs/node';

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  output: 'server',
  image: {
    domains: ["github.com", "imgur.com", "cdn.discordapp.com"],
    remotePatterns: [{
      protocol: "https"
    }]
  },
  adapter: nodejs({
    mode: 'standalone',
  }),
});