#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Scans images/projects/* for .jpg/.png files and writes projects/data/projects.json

const projectsDir = path.join(__dirname, '..', 'images', 'projects');
const outDir = path.join(__dirname, '..', 'projects', 'data');
const outFile = path.join(outDir, 'projects.json');

function isImageFile(name){
  const ext = path.extname(name).toLowerCase();
  return ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.webp';
}

if(!fs.existsSync(projectsDir)){
  console.error('projects images directory not found:', projectsDir);
  process.exit(1);
}

if(!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const projects = {};
const entries = fs.readdirSync(projectsDir, { withFileTypes: true });
for(const e of entries){
  if(!e.isDirectory()) continue;
  const pName = e.name;
  const pPath = path.join(projectsDir, pName);
  const files = fs.readdirSync(pPath).filter(isImageFile).sort();
  projects[pName] = files;
}

fs.writeFileSync(outFile, JSON.stringify(projects, null, 2), 'utf8');
console.log('Wrote', outFile);
