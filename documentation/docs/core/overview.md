---
title: Core Package Overview
sidebar_label: Core Package
---

# Core Package Overview

The **Core Package** is the foundational, framework-agnostic engine that powers the entire **Page Builder ecosystem**. It is the **central authority** for all design, component, and state logic.

---

## Purpose

The core's primary responsibility is to manage the design's **abstract syntax tree (AST)** or **component graph**, ensuring **consistency and functionality** across all platforms where the builder is deployed.

It is designed to be **decoupled** from any specific UI framework (React, Angular, etc.).

---

## Key Responsibilities

| Responsibility              | Description                                                                                                                                                                      |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Design State Management** | Manages the single source of truth for the entire page design, including component hierarchy, attributes, and styling.                                                           |
| **Core Logic Execution**    | Executes features like formula calculation, attribute data seeding, and design serialization/deserialization (Export/Import).                                                    |
| **Abstract Rendering**      | Provides the necessary logic and structure (e.g., component registration, event mapping) that the individual wrappers use to render the visual editor and output the final HTML. |
| **Extensibility**           | Defines the APIs for integrating Custom Components and Custom Plugins, ensuring consistency regardless of the framework used.                                                    |

---

## Architecture

All features—including **Drag-and-Drop, State Persistence, and Advanced Attributes**—are fundamentally defined and controlled by the **Core Package**.

The **wrapper packages** (React, Angular, Web Component) act merely as **thin view layers**, providing:

- The necessary hooks
- Framework-specific components
- A bridge to interface with the Core's engine

This ensures that the **Core logic remains consistent**, while still being accessible across different ecosystems.

---
