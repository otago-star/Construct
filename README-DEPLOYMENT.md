Netlify deployment and serverless proxy for review submissions

Steps to deploy the serverless proxy and enable site review submissions:

1) Connect your repository to Netlify
   - Create a new site on Netlify and link it to this GitHub repository.

2) Add environment variables on Netlify (Site settings -> Build & deploy -> Environment):
   - NETLIFY_GH_PAT = <a GitHub Personal Access Token (repo scope) used by the function to call GitHub API>
   - GITHUB_REPO = otago-star/Construct  (owner/repo)
   - REVIEW_CLIENT_TOKEN = <a short secret that the client will send; keep this secret in Netlify>  

3) After deploy, set SiteConfig in assets/js/site-config.js to the deployed function URL and the client token:
   - repoDispatchEndpoint: https://loquacious-marshmallow-b403c4.netlify.app/.netlify/functions/submit-review
   - reviewClientToken: <the same REVIEW_CLIENT_TOKEN value>

4) How it works
   - The site posts reviews to the Netlify function endpoint with { token, review_text, author }.
   - The function validates the token and then calls GitHub's repository_dispatch API with event_type 'submit-review'.
   - The previously-added GitHub Actions workflow listens for the repository_dispatch and will commit the review into projects/data/reviews.json.

5) Security notes
   - Do NOT embed NETLIFY_GH_PAT in client-side code. Keep it only in Netlify env settings.
   - The REVIEW_CLIENT_TOKEN is a short token to prevent casual misuse; for stronger security, enforce origins or add additional checks.
