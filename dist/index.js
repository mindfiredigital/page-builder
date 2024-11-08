import { Canvas } from './canvas/Canvas.js';
import { Sidebar } from './sidebar/ConfigSidebar.js';
import { createSidebar } from './sidebar/CreateSidebar.js';
import { createNavbar } from './navbar/CreateNavbar.js';
import { HTMLGenerator } from './services/HTMLGenerator.js';
import { JSONStorage } from './services/JSONStorage.js';
document.addEventListener('DOMContentLoaded', () => {
  var _a, _b, _c, _d, _e, _f, _g;
  const canvas = new Canvas();
  const sidebar = new Sidebar(canvas);
  const htmlGenerator = new HTMLGenerator(canvas);
  const jsonStorage = new JSONStorage();
  createSidebar();
  Canvas.init();
  sidebar.init();
  const header = document.createElement('header');
  header.appendChild(createNavbar());
  document.body.insertBefore(header, document.getElementById('app'));
  // Additional event listeners for exporting or saving
  (_a = document.getElementById('save-btn')) === null || _a === void 0
    ? void 0
    : _a.addEventListener('click', () => {
        const layoutJSON = Canvas.getState();
        jsonStorage.save(layoutJSON);
      });
  (_b = document.getElementById('export-html-btn')) === null || _b === void 0
    ? void 0
    : _b.addEventListener('click', () => {
        const html = htmlGenerator.generateHTML();
        console.log('Generated HTML:', html);
      });
  (_c = document.getElementById('preview-desktop')) === null || _c === void 0
    ? void 0
    : _c.addEventListener('click', () => {
        const canvas = document.getElementById('canvas');
        canvas.classList.remove('preview-tablet', 'preview-mobile');
        canvas.classList.add('preview-desktop');
      });
  (_d = document.getElementById('preview-tablet')) === null || _d === void 0
    ? void 0
    : _d.addEventListener('click', () => {
        const canvas = document.getElementById('canvas');
        canvas.classList.remove('preview-desktop', 'preview-mobile');
        canvas.classList.add('preview-tablet');
      });
  (_e = document.getElementById('preview-mobile')) === null || _e === void 0
    ? void 0
    : _e.addEventListener('click', () => {
        const canvas = document.getElementById('canvas');
        canvas.classList.remove('preview-desktop', 'preview-tablet');
        canvas.classList.add('preview-mobile');
      });
  //Functionality for undo button
  (_f = document.getElementById('undo-btn')) === null || _f === void 0
    ? void 0
    : _f.addEventListener('click', () => {
        Canvas.historyManager.undo();
      });
  //Functionality for redo button
  (_g = document.getElementById('redo-btn')) === null || _g === void 0
    ? void 0
    : _g.addEventListener('click', () => {
        Canvas.historyManager.redo();
      });
});
