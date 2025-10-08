---
title: Dynamic Attributes and Formulas
sidebar_label: Dynamic Attributes
---

# Dynamic Attributes and Formulas

The core package provides a powerful system for creating **dynamic, data-driven components** through flexible attribute configuration. Attributes can integrate **mathematical formulas, static constants, data seeding, and real-time event handling**.

---

## 1. Attribute Definition

Attributes are defined by passing a configuration object that includes properties for **value calculation, data binding, and user input type**.

| Property       | Description                                                                                                                                                     |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `inputType`    | Defines the type of control displayed to the user (e.g., `text`, `number`, `select`).                                                                           |
| `formula`      | A string representation of the calculation to be executed (e.g., `(input1 * constant) + input2`). The formula references other attributes or constants by name. |
| `constant`     | A static value that can be referenced within the formula string.                                                                                                |
| `defaultValue` | The initial value displayed in the attribute field when the component is first loaded.                                                                          |

---

## 2. Data Seeding (Data Binding)

Attributes are not limited to user input; they can be **dynamically populated by external data sources**.

- **Seeding**: You can seed an attribute's value by binding it to a specific table cell or data field.
- **Mechanism**: This establishes a **live link** where the initial attribute value is drawn from the specified data source, making the component **data-aware**.

---

## 3. Event-Driven Formula Execution

To enable **interactivity and real-time calculation**, you can define a **callback function** that is triggered by specific user interactions.

### A. Callback Function Registration

The Page Builder allows you to register a **custom JavaScript function** that houses your application's complex logic. This function is passed to the builder during initialization.

### B. Event Triggering

For any input attribute, you can explicitly define the **event** that should trigger the registered callback function (e.g., `onChange`, `onBlur`).

1. A user interacts with the input field.
2. The specified event fires (`onChange` or `onBlur`).
3. The configured callback function is triggered.

### C. Result and Display

When the callback function executes, it performs the necessary calculations using the configured formulas.

The function must return an object containing:

- **Calculated Values** → Derived from executing the defined formula strings.
- **Display Value** → The specific calculated value that should be displayed back to the user in the input attribute's field.

---

## 4. Important Note on Default Value

The `defaultValue` property is fully supported and prioritized.

- When an attribute is defined with both a `formula` and a `defaultValue`, the **defaultValue will be displayed first**.
- The **formula calculation only takes precedence** after the event handler (defined in step 3) is triggered by user interaction.
- This ensures a **base or suggested value** is always shown upon initial load.

---
