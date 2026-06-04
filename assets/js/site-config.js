// Site configuration for endpoints used by client code.
// After deploying the Netlify function, set REPO_DISPATCH_ENDPOINT to your function URL,
// for example: https://your-site.netlify.app/.netlify/functions/submit-review

window.SiteConfig = window.SiteConfig || {};
window.SiteConfig.repoDispatchEndpoint = window.SiteConfig.repoDispatchEndpoint || '';
window.SiteConfig.reviewClientToken = window.SiteConfig.reviewClientToken || '';

// Example usage (uncomment and fill when ready):
// window.SiteConfig.repoDispatchEndpoint = 'https://your-site.netlify.app/.netlify/functions/submit-review';
// window.SiteConfig.reviewClientToken = 'SHORT_CLIENT_TOKEN';

// Optional: load images directly from GitHub raw URLs when the site is not served from the repo root.
// Set to true and provide githubRepo (owner/repo) and githubBranch (default: main).
// Example:
// window.SiteConfig.useGitHubRaw = true;
// window.SiteConfig.githubRepo = 'otago-star/Construct';
// window.SiteConfig.githubBranch = 'main';

// Enabled by default for this repository so pages load images directly from GitHub raw
window.SiteConfig.useGitHubRaw = true;
window.SiteConfig.githubRepo = 'otago-star/Construct';
window.SiteConfig.githubBranch = 'main';

window.SiteConfig = window.SiteConfig || {}; window.SiteConfig.repoDispatchEndpoint = 'https://loquacious-marshmallow-b403c4.netlify.app/.netlify/functions/submit-review'; window.SiteConfig.reviewClientToken = 'nfp_6naDXt3zBcJW7jZiYKBySiMZzEzRv9g1b815';