export default function Placeholder({ icon, title, description }) {
  return (
    <div className="page animate-fade-in">
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        textAlign: 'center',
        gap: '16px',
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: 'var(--radius-2xl)',
          background: 'rgba(173, 242, 189, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '40px', color: 'var(--color-primary-container)' }}>
            {icon}
          </span>
        </div>
        <div>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '24px',
            fontWeight: '600',
            color: 'var(--color-primary)',
            marginBottom: '8px',
          }}>
            {title}
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)', maxWidth: '360px' }}>
            {description}
          </p>
        </div>
        <div style={{
          padding: '8px 20px',
          borderRadius: 'var(--radius-full)',
          background: 'var(--color-surface-container)',
          fontSize: '12px',
          fontWeight: '600',
          color: 'var(--color-on-surface-variant)',
          letterSpacing: '0.06em',
        }}>
          SEGERA HADIR
        </div>
      </div>
    </div>
  );
}
