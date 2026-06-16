import React, { forwardRef, Ref, useLayoutEffect, useRef } from 'react';
import { useTextStore, TEXT_DEFAULTS } from '../store/TextStore';

interface CustomTextProps {
  componentId?: string;
}

const CustomText = forwardRef(
  (props: CustomTextProps, _ref: Ref<HTMLDivElement>) => {
    const id = (props as any).componentId || 'default';
    const hasSettings = useTextStore(state => id in state.settings);
    const s = useTextStore(state => state.settings[id] ?? TEXT_DEFAULTS);
    const set = useTextStore(state => state.set);
    const innerRef = useRef<HTMLDivElement>(null);

    // On first mount: disable the outer canvas element from being contenteditable
    // (typing/list commands target the inner contentEditable div), restore saved
    // settings from data-pb-settings, and attach a capture-phase input listener
    // so content is written to data-pb-settings BEFORE CanvasComponentFactory's
    // bubble-phase listener calls dispatchDesignChange() and saves to localStorage.
    useLayoutEffect(() => {
      const el = document.getElementById(id);
      if (!(el instanceof HTMLElement)) return;

      el.setAttribute('contenteditable', 'false');

      if (!hasSettings) {
        const saved = el.getAttribute('data-pb-settings');
        if (saved) {
          try {
            set(id, JSON.parse(saved));
          } catch {}
        }
      }

      const syncContent = () => {
        // Use innerHTML so bullet/ordered list HTML structure is preserved.
        const html = innerRef.current?.innerHTML ?? '';
        const currentSettings =
          useTextStore.getState().settings[id] ?? TEXT_DEFAULTS;
        el.setAttribute(
          'data-pb-settings',
          JSON.stringify({ ...currentSettings, content: html })
        );
        set(id, { content: html });
      };

      // Capture phase: runs before CanvasComponentFactory's bubble-phase listener.
      el.addEventListener('input', syncContent, true);
      return () => el.removeEventListener('input', syncContent, true);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    // Sync store content → DOM when the inner div is not focused.
    // Uses innerHTML so bullet/list HTML is restored correctly.
    // Skipping the update while focused avoids cursor resets during active editing.
    useLayoutEffect(() => {
      const div = innerRef.current;
      if (!div || document.activeElement === div) return;
      if (div.innerHTML !== s.content) {
        div.innerHTML = s.content;
      }
    }, [s.content]);

    // Keep data-pb-settings on the outer element in sync after each render.
    // Guard with hasSettings so the first render never overwrites a correctly-
    // restored attribute with TEXT_DEFAULTS.
    useLayoutEffect(() => {
      if (!hasSettings) return;
      const el = document.getElementById(id);
      if (el instanceof HTMLElement) {
        el.setAttribute('data-pb-settings', JSON.stringify(s));
      }
    });

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key !== 'Enter') return;
      // Inside a list item: let the browser handle Enter naturally so a new
      // <li> is created. Outside a list: insert <br> instead of the browser's
      // default <div>/<p> wrapping to keep the innerHTML predictable.
      const sel = window.getSelection();
      let node: Node | null = sel?.focusNode ?? null;
      while (node && node !== innerRef.current) {
        if (node instanceof Element && node.tagName === 'LI') return;
        node = node.parentNode;
      }
      e.preventDefault();
      document.execCommand('insertHTML', false, '<br>');
    };

    return (
      <div
        ref={innerRef}
        contentEditable
        suppressContentEditableWarning
        onKeyDown={handleKeyDown}
        style={{
          fontFamily: s.fontFamily,
          fontSize: `${s.fontSize}px`,
          fontWeight: s.fontWeight,
          fontStyle: s.fontStyle,
          textDecoration: s.textDecoration,
          textTransform:
            s.textTransform as React.CSSProperties['textTransform'],
          textAlign: s.textAlign as React.CSSProperties['textAlign'],
          color: s.color,
          backgroundColor:
            s.backgroundColor === 'transparent' ? undefined : s.backgroundColor,
          lineHeight: s.lineHeight,
          letterSpacing: `${s.letterSpacing}px`,
          wordSpacing: `${s.wordSpacing}px`,
          paddingTop: `${s.paddingTop}px`,
          paddingRight: `${s.paddingRight}px`,
          paddingBottom: `${s.paddingBottom}px`,
          paddingLeft: `${s.paddingLeft}px`,
          borderWidth: s.borderWidth > 0 ? `${s.borderWidth}px` : undefined,
          borderStyle: s.borderWidth > 0 ? s.borderStyle : undefined,
          borderColor: s.borderWidth > 0 ? s.borderColor : undefined,
          borderRadius: s.borderRadius > 0 ? `${s.borderRadius}px` : undefined,
          textShadow: s.textShadow === 'none' ? undefined : s.textShadow,
          boxShadow: s.boxShadow === 'none' ? undefined : s.boxShadow,
          opacity: s.opacity < 1 ? s.opacity : undefined,
          maxWidth: s.maxWidth,
          width: '100%',
          boxSizing: 'border-box',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          outline: 'none',
        }}
      />
    );
  }
);

CustomText.displayName = 'CustomText';
export default CustomText;
