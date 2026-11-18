import type { NextConfig } from 'next';
import path from 'node:path';

const nextConfig: NextConfig = {
  // Emit a self-contained server (.next/standalone) for the production image.
  // See infra/docker/Dockerfile.web.
  output: 'standalone',
  // pnpm keeps deps in the workspace-root store, so trace from the monorepo root.
  outputFileTracingRoot: path.join(import.meta.dirname, '../../'),
  // The web imports @autotest/core as TypeScript source.
  transpilePackages: ['@autotest/core'],
};

export default nextConfig;
