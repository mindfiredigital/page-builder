import React, { useEffect } from 'react';

const PageBuilderComponent = () => {
  useEffect(() => {
    // Load the web component dynamically
    const loadPageBuilder = async () => {
      try {
        await import('@mindfiredigital/page-builder-web-component');
        console.log('Page Builder Web Component loaded successfully');
      } catch (error) {
        console.error('Error loading Page Builder Web Component:', error);
      }
    };

    loadPageBuilder();
  }, []);

  return <page-builder />;
};

export default PageBuilderComponent;
