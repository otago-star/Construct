const fetch = require('node-fetch');

// Netlify Function: submit-review
// Expects POST JSON: { token, review_text, author }
// Validates token against process.env.REVIEW_CLIENT_TOKEN
// Forwards to GitHub repository_dispatch using NETLIFY_GH_PAT and repo from env: GITHUB_REPO (owner/repo)

exports.handler = async function(event, context){
  if(event.httpMethod !== 'POST'){
	return { statusCode: 405, body: 'Method Not Allowed' };
  }
  let body = {};
  try{
	body = JSON.parse(event.body || '{}');
  }catch(e){
	return { statusCode: 400, body: 'Invalid JSON' };
  }
  const { token, review_text, author } = body;
  if(!token || !review_text){
	return { statusCode: 400, body: 'Missing token or review_text' };
  }
  const expected = process.env.REVIEW_CLIENT_TOKEN || '';
  if(token !== expected){
	return { statusCode: 401, body: 'Invalid token' };
  }
  const ghPat = process.env.NETLIFY_GH_PAT;
  const repo = process.env.GITHUB_REPO; // e.g., owner/repo
  if(!ghPat || !repo){
	return { statusCode: 500, body: 'Server not configured' };
  }
  const payload = {
	event_type: 'submit-review',
	client_payload: {
	  token: expected,
	  review_text: review_text,
	  author: author || 'Guest'
	}
  };

  const url = `https://api.github.com/repos/${repo}/dispatches`;
  try{
	const res = await fetch(url, {
	  method: 'POST',
	  headers: {
		'Authorization': `token ${ghPat}`,
		'Accept': 'application/vnd.github+json',
		'Content-Type': 'application/json'
	  },
	  body: JSON.stringify(payload)
	});
	if(res.status >= 200 && res.status < 300){
	  return { statusCode: 200, body: JSON.stringify({ ok:true }) };
	} else {
	  const t = await res.text();
	  return { statusCode: 502, body: `GitHub API error: ${res.status} ${t}` };
	}
  }catch(e){
	return { statusCode: 502, body: `Fetch error: ${e.message}` };
  }
};
