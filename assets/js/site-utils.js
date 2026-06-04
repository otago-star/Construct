// site-utils.js - small helper to fetch the generated projects manifest and expose helpers
const SiteUtils = (function(){
  let manifest = null;
  async function loadManifest(){
	if(manifest) return manifest;
	try{
	  // try a few paths to be robust when pages are served from subfolders or root
	  const candidates = ['/projects/data/projects.json','projects/data/projects.json','./projects/data/projects.json'];
	  let data = null;
	  for(const p of candidates){
		try{
		  const res = await fetch(p, {cache: 'no-store'});
		  if(!res.ok) continue;
		  data = await res.json();
		  break;
		}catch(e){ continue; }
	  }
	  manifest = data || {};
	}catch(e){
	  // fallback to empty
	  manifest = {};
	}
	return manifest;
  }

  async function getProjectImages(project){
	const m = await loadManifest();
	let list = m[project] || [];
	// If the manifest has a single string, normalize to array
	if(list && typeof list === 'string') list = [list];
	if(!Array.isArray(list)) list = [];

	// Determine if running over HTTP(S) or file://
	const isHttp = (typeof location !== 'undefined' && location.protocol && location.protocol.startsWith('http'));

	// Fallback count can be provided via a data attribute (documentElement or body), default to 7
	const rawFallback = (typeof document !== 'undefined' && (document.documentElement.dataset.fallbackCount || (document.body && document.body.dataset.fallbackCount))) || '7';
	const fallbackCount = Math.max(parseInt(rawFallback, 10) || 7, 0);

	// If manifest has no images for this project, synthesize numeric fallbacks: 1.jpg .. N.jpg
	if(list.length === 0){
	  for(let i = 1; i <= fallbackCount; i++){
		list.push(`${i}.jpg`);
	  }
	}

	// If configured, prefer GitHub raw URLs (useful when site is opened from file:// or not served)
	const cfg = (typeof window !== 'undefined' && window.SiteConfig) ? window.SiteConfig : null;
	if(cfg && cfg.useGitHubRaw && cfg.githubRepo){
	  const branch = cfg.githubBranch || 'main';
	  return list.map(f => `https://raw.githubusercontent.com/${cfg.githubRepo}/${branch}/images/projects/${project}/${f}`);
	}
	// If page is within /projects/ path, prefer '../../images/projects/...' which resolves correctly
	// both for file:// and when served from the site root.
	const path = (typeof location !== 'undefined' ? location.pathname : '');
	if(path.indexOf('/projects/') !== -1){
	  return list.map(f => `../../images/projects/${project}/${f}`);
	}
	// Build paths: root-absolute for HTTP(s), relative for file:// based on page depth.
	if(isHttp){
	  return list.map(f => `/images/projects/${project}/${f}`);
	} else {
	  const segments = (typeof location !== 'undefined' ? location.pathname.split('/').filter(Boolean) : []);
	  const up = Math.max(segments.length - 1, 0);
	  const prefix = up > 0 ? '../'.repeat(up) : '';
	  return list.map(f => `${prefix}images/projects/${project}/${f}`);
	}
  }

	// Create an <img> element that will attempt several candidate paths (different extensions
  // and relative prefixes) and fall back to a placeholder if none load.
  function createImageElement(project, nameOrFilename, index){
	const im = (typeof document !== 'undefined') ? document.createElement('img') : { dataset: {}, setAttribute(){}, onerror:null };
	if(typeof document !== 'undefined'){
	  im.dataset.index = index;
	  im.loading = 'lazy';
	} else {
	  im.dataset = { index };
	}

	const isFilename = typeof nameOrFilename === 'string' && nameOrFilename.indexOf('.') !== -1;
	const exts = isFilename ? [''] : ['.jpg','.jpeg','.png','.webp'];
	const candidates = [];

	const isHttp = (typeof location !== 'undefined' && location.protocol && location.protocol.startsWith('http'));
	const segments = (typeof location !== 'undefined' ? location.pathname.split('/').filter(Boolean) : []);

	for(const ext of exts){
	  const fname = isFilename ? nameOrFilename : (nameOrFilename + ext);
	  if(isHttp){
		candidates.push(`/images/projects/${project}/${fname}`);
	  }
	  // page-root relative
	  candidates.push(`images/projects/${project}/${fname}`);
	  // relative up levels
	  for(let i=1;i<=segments.length;i++){
		candidates.push('../'.repeat(i) + `images/projects/${project}/${fname}`);
	  }
	}

	// de-dupe while preserving order
	im._candidates = Array.from(new Set(candidates));
	im._tryIndex = 0;

	const placeholder = (isHttp ? '/images/placeholder.svg' : 'images/placeholder.svg');
	im.src = im._candidates[0] || placeholder;
	if(typeof document !== 'undefined'){
	  im.onerror = function(){
		this._tryIndex++;
		if(this._tryIndex < this._candidates.length){
		  this.src = this._candidates[this._tryIndex];
		} else {
		  this.onerror = null;
		  this.src = placeholder;
		}
	  };
	}
	return im;
  }

  return { loadManifest, getProjectImages, createImageElement };
})();

window.SiteUtils = SiteUtils;