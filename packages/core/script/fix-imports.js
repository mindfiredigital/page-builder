const fs = require('fs');
const path = require('path');

/**
 * Resolves a relative import path to the correct .js extension.
 * Handles both file imports (foo -> foo.js) and directory barrel imports
 * (components -> components/index.js).
 */
function resolveImportSuffix(fileDir, importPath) {
  // Already has an extension — leave it alone
  if (/\.[a-z]+$/.test(importPath)) return importPath;

  const absoluteTarget = path.join(fileDir, importPath);

  // Direct file match (foo.js)
  if (fs.existsSync(absoluteTarget + '.js')) {
    return importPath + '.js';
  }

  // Directory barrel (components/index.js)
  if (
    fs.existsSync(absoluteTarget) &&
    fs.statSync(absoluteTarget).isDirectory() &&
    fs.existsSync(path.join(absoluteTarget, 'index.js'))
  ) {
    return importPath + '/index.js';
  }

  // Default fallback
  return importPath + '.js';
}

function addJsExtensions(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      addJsExtensions(filePath);
    } else if (filePath.endsWith('.js')) {
      let content = fs.readFileSync(filePath, 'utf8');
      const fileDir = path.dirname(filePath);

      // Match relative imports/exports that have no extension yet
      content = content.replace(
        /((?:import|export)[^'"]*from\s+['"])(\.\.?\/[^'"]+)(['"]\s*;?)/g,
        (match, prefix, importPath, suffix) => {
          const resolved = resolveImportSuffix(fileDir, importPath);
          return `${prefix}${resolved}${suffix}`;
        }
      );

      fs.writeFileSync(filePath, content, 'utf8');
    }
  });
}

addJsExtensions(path.join('dist'));
