Run the script to generate a JSON manifest of project images.

Requirements: Node.js installed.

Usage:
  node scripts/generate-projects.js

This scans the images/projects/ subfolders for image files (.jpg, .jpeg, .png, .webp) and writes projects/data/projects.json
The generated JSON maps project folder names to arrays of filenames, e.g.
{
  "project1": ["1.jpg","2.jpg"],
  "project2": ["1.jpg"]
}

Notes:
- The frontend will use projects/data/projects.json if present to build galleries automatically.
- Serve the site over a local static server (e.g., `npx http-server`) to allow fetch() to read the JSON file.
