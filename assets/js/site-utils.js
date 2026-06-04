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
	const list = m[project] || [];
	// return absolute relative paths under images/projects/project/
	// Use root-absolute paths so pages in subfolders resolve correctly
	return list.map(f => `/${'images'}/projects/${project}/${f}`);
  }

  return { loadManifest, getProjectImages };
})();

window.SiteUtils = SiteUtils;