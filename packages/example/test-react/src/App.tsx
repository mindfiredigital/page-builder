import { PageBuilderWrapper } from '@mindfiredigital/page-builder-react';

const App = () => {

  return (
    <div style={{ width: '100%', height: '100%' }}>
  <PageBuilderWrapper
    onInitialize={(pageBuilder) => {
      // Optional initialization logic
      console.log('PageBuilder initialized', pageBuilder);
    }}
  />
</div>

  );
};

export default App;