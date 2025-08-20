import mindfireLogo from '../assets/mindfireLogo.webp';

function Image() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '16px',
      }}
    >
      <img src={mindfireLogo} width={200} height={90} alt="Company Logo" />
    </div>
  );
}

export default Image;
