const Footer = () => (
  <footer
    style={{
      position: 'relative',
      width: '100%',
      height: '64px',
      zIndex: 50,
    }}
  >
    <div
      style={{
        margin: '0 auto',
        maxWidth: '1200px',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        padding: '0 1rem',
        color: 'var(--muted-foreground)',
        fontSize: '0.875rem',
      }}
    >
      {/* Left: copyright */}
      <p style={{ margin: 0 }}>© {new Date().getFullYear()} Mindfire FOSS</p>
    </div>
  </footer>
);

export default Footer;
