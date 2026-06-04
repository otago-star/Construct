// Site configuration for endpoints used by client code.
// After deploying the Netlify function, set REPO_DISPATCH_ENDPOINT to your function URL,
// for example: https://your-site.netlify.app/.netlify/functions/submit-review

window.SiteConfig = window.SiteConfig || {};
window.SiteConfig.repoDispatchEndpoint = window.SiteConfig.repoDispatchEndpoint || '';
window.SiteConfig.reviewClientToken = window.SiteConfig.reviewClientToken || '';

// Example usage (uncomment and fill when ready):
// window.SiteConfig.repoDispatchEndpoint = 'https://your-site.netlify.app/.netlify/functions/submit-review';
// window.SiteConfig.reviewClientToken = 'SHORT_CLIENT_TOKEN';

window.SiteConfig = window.SiteConfig || {}; window.SiteConfig.repoDispatchEndpoint = 'https://loquacious-marshmallow-b403c4.netlify.app/.netlify/functions/submit-review'; window.SiteConfig.reviewClientToken = 'nfp_6naDXt3zBcJW7jZiYKBySiMZzEzRv9g1b815';