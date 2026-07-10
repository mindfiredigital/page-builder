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
    static restore(container) {
        const generateId = () => `rt-block-${Date.now()}-${++RichTextComponent.blockCounter}`;
        const manager = new RichTextPopoverManager(container, generateId);
        manager.init();
        container.querySelectorAll('.rt-block').forEach(blockEl => {
            const block = blockEl;
            const addBtn = block.querySelector('.rt-add-btn');
            const tuneBtn = block.querySelector('.rt-tune-btn');
            if (addBtn) {
                addBtn.addEventListener('click', e => {
                    e.stopPropagation();
                    manager.toggleAddPopover(block, addBtn);
                });
            }
            if (tuneBtn) {
                tuneBtn.addEventListener('click', e => {
                    e.stopPropagation();
                    manager.toggleTunePopover(block, tuneBtn);
                });
            }
        });
    }
}
RichTextComponent.blockCounter = 0;
