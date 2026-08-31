---
title: Rich Text Editor
sidebar_label: Rich Text Editor
---

# Rich Text Editor

The **Rich Text** component is a block-based editor you can drop onto the canvas, similar in spirit to Notion or Editor.js. Instead of one editable field, content is a stack of independent **blocks** — paragraphs, headings, images, lists, code, and more — each with its own type and its own set of controls.

---

## Adding it to your project

Enable it like any other component by including `richtext` in your `dynamicComponents` config:

```javascript
const dynamicComponents = {
  Basic: [
    { name: 'text' },
    { name: 'header' },
    { name: 'richtext' },
    // ...other components
  ],
  Extra: [],
};
```

Once enabled, drag **Rich Text** from the sidebar onto the canvas. A new instance starts with a single empty **Text** block.

---

## Block types

Click the **`+`** button on a block to open the add-block popover, which is filterable by typing. Choosing a type inserts a new block directly below the current one.

| Type          | Description                                                               |
| ------------- | ------------------------------------------------------------------------- |
| **Text**      | A plain editable paragraph.                                               |
| **Heading**   | A heading with a configurable level (see [Tune actions](#tune-actions-)). |
| **Image**     | An image block with border/stretch/background display options.            |
| **List**      | A bulleted or numbered list; each item is independently editable.         |
| **Code**      | A code block with a light/dark theme toggle.                              |
| **Quote**     | A blockquote.                                                             |
| **Delimiter** | A visual section break.                                                   |
| **Raw HTML**  | Arbitrary embedded HTML.                                                  |
| **Warning**   | A callout with a title and a message.                                     |
| **Checklist** | A list of checkable items.                                                |

---

## Block controls

Every block shows two controls on hover/focus:

- **`+` (Add block)** — opens the filterable block-type popover and inserts the chosen type directly below.
- **`⠿` (Tune)** — opens a filterable popover of actions for the current block (see below).

### Tune actions {#tune-actions-}

The tune popover is contextual — it shows actions relevant to the block's current type first, followed by actions available on every block:

- **Convert to** — opens a submenu to change the block's type. Existing text is carried over into the new block where that makes sense (e.g. a list's items become a paragraph's text).
- **Alignment** — left / center / right, for text-like blocks.
- **Heading level** — for Heading blocks.
- **List style** — toggle between unordered (bulleted) and ordered (numbered), for List blocks.
- **Code theme** — toggle light/dark, for Code blocks.
- **Image options** — toggle border, stretch-to-fill, and background, for Image blocks.
- **Move up / Move down** — reorder the block relative to its siblings.
- **Delete** — remove the block. Deleting the last remaining block automatically inserts a fresh empty Text block so the editor is never left empty.

---

## Notes

- Each Rich Text instance manages its own blocks independently — block IDs are scoped per-instance, so multiple Rich Text components can live on the same page without colliding.
- The Rich Text component is a canvas-only feature. The [pagectl CLI](../../Getting-started/cli.md) does not support `richtext` blocks in its v1 scope — see `pagectl schema`'s `scope.outOfScope` list.
