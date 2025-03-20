import { PageBuilderReact } from '@mindfiredigital/page-builder-react';

const App = () => {
  const dynamicComponents = {
    Basic: [
      'button',
      'header',
      'text',
    ],
    Extra: ['landingpage'],
    Custom: [],
  };  
  return (
    <div>
      <PageBuilderReact config={dynamicComponents}/>
    </div>
  );
};

export default App;
