const fs = require('fs');
const path = require('path');

function addJsExtensions(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      addJsExtensions(filePath);
    } else if (filePath.endsWith('.js')) {
      let content = fs.readFileSync(filePath, 'utf8');
      content = content.replace(/(from\s+["']\..+?)["']/g, "$1.js'");
      fs.writeFileSync(filePath, content, 'utf8');
    }
  });
}

addJsExtensions(path.join('dist'));
