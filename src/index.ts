import { Canvas } from './canvas/Canvas';
import { Sidebar } from './sidebar/ConfigSidebar';
import { HTMLGenerator } from './services/HTMLGenerator';
import { JSONStorage } from './services/JSONStorage';

document.addEventListener('DOMContentLoaded', () => {
  const canvas = new Canvas();
  const sidebar = new Sidebar(canvas);
  const htmlGenerator = new HTMLGenerator(canvas);
  const jsonStorage = new JSONStorage();

  canvas.init();
  sidebar.init();

  // Additional event listeners for exporting or saving
  document.getElementById('save-btn')?.addEventListener('click', () => {
    const layoutJSON = canvas.exportLayout();
    jsonStorage.save(layoutJSON);
  });

  document.getElementById('export-html-btn')?.addEventListener('click', () => {
    const html = htmlGenerator.generateHTML();
    console.log('Generated HTML:', html);
  });
  document.getElementById('preview-desktop')?.addEventListener('click', () => {
    const canvas = document.getElementById('canvas')!;
    canvas.classList.remove('preview-tablet', 'preview-mobile');
    canvas.classList.add('preview-desktop');
  });

  document.getElementById('preview-tablet')?.addEventListener('click', () => {
    const canvas = document.getElementById('canvas')!;
    canvas.classList.remove('preview-desktop', 'preview-mobile');
    canvas.classList.add('preview-tablet');
  });

  document.getElementById('preview-mobile')?.addEventListener('click', () => {
    const canvas = document.getElementById('canvas')!;
    canvas.classList.remove('preview-desktop', 'preview-tablet');
    canvas.classList.add('preview-mobile');
  });
});
