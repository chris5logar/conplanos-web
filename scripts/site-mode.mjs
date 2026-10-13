// Cloudflare Pages sets CF_PAGES_BRANCH on every build. Only the production
// branch may be indexable and measured; every other branch is a preview.
const productionBranch = 'main';

export function siteMode(env = process.env) {
  const cloudflarePreview = Boolean(env.CF_PAGES_BRANCH) && env.CF_PAGES_BRANCH !== productionBranch;
  return {
    preview: env.SITE_MODE === 'preview' || cloudflarePreview,
    // CF_PAGES_URL is the URL of the deployment being built.
    cloudflareOrigin: cloudflarePreview ? env.CF_PAGES_URL : undefined
  };
}
