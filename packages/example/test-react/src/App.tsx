import { PageBuilderReact } from '@mindfiredigital/page-builder-react';

const App = () => {
  // Config object for dynamic components
  const dynamicComponents = {
    Basic: [
      'button',
      'header',
      'text',
      'twoCol',
      'threeCol'
    ],
    Extra: ['landingpage'],
    Custom: {},
  };  
  return (
    <div>
      <PageBuilderReact config={dynamicComponents}/>
    </div>
  );
};

export default App;
