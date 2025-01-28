import { PageBuilderReact } from '@mindfiredigital/page-builder-react';

const App = () => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <PageBuilderReact
        onInitialize={pageBuilder => {
          // Optional initialization logic
          console.log('PageBuilder initialized', pageBuilder);
        }}
        customStyles={{
          wrapper: {
            backgroundColor: '#f5f5f5',
          },
        }}
      />
    </div>
  );
};

export default App;
