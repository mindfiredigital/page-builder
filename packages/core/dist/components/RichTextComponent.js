import { RichTextPopoverManager } from './RichTextCore/index.js';
export class RichTextComponent {
    create() {
        const root = document.createElement('div');
        root.classList.add('rich-text-component');
        const generateId = () => `rt-block-${Date.now()}-${++RichTextComponent.blockCounter}`;
        const manager = new RichTextPopoverManager(root, generateId);
        manager.init();
        root.appendChild(manager.createBlock('text'));
        return root;
    }
    static restore(_container) {
        // Implemented in a later step when block data is persisted
    }
}
RichTextComponent.blockCounter = 0;
