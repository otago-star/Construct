// site-utils.js - small helper to fetch the generated projects manifest and expose helpers
const SiteUtils = (function(){
  let manifest = null;
  async function loadManifest(){
	if(manifest) return manifest;
	try{
	  const res = await fetch('/projects/data/projects.json', {cache: 'no-store'});
	  if(!res.ok) throw new Error('Not found');
	  manifest = await res.json();
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
	return list.map(f => `images/projects/${project}/${f}`);
  }

  return { loadManifest, getProjectImages };
})();

window.SiteUtils = SiteUtils;