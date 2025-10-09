# State Management

## Overview

State management in the Page Builder allows users to persist their designs, save configurations to a database, and restore previous states. This feature enables users to work on designs across sessions and maintain version history.

## Saving Design State

### Initial Design Configuration

You can pass an initial design state to the Page Builder to restore a previously saved layout:

```jsx
import { PageBuilderReact } from '@mindfiredigital/page-builder-react';
import { useState, useEffect } from 'react';

const App = () => {
  const [initialDesign, setInitialDesign] = useState(null);

  // Load saved design from database
  useEffect(() => {
    const loadDesign = async () => {
      const response = await fetch('/api/designs/123');
      const savedDesign = await response.json();
      setInitialDesign(savedDesign);
    };

    loadDesign();
  }, []);

  return (
    <PageBuilderReact
      initialDesign={initialDesign}
      onDesignChange={handleDesignChange}
    />
  );
};
```
