export default function Win95Window({ title, icon, children, width = 500 }) {
  return (
    <div
      style={{
        position: 'relative',
        minWidth: 320,
        width: width,
        background: '#ffe4ef',
        border: '2px solid #ff69b4',
        boxShadow: '4px 4px 0 #ff69b4',
        borderRadius: 8,
        margin: 16,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#ffb6d5',
          borderBottom: '2px solid #ff69b4',
          borderTopLeftRadius: 6,
          borderTopRightRadius: 6,
          padding: '6px 12px',
          fontFamily: 'MS Sans Serif',
          fontWeight: 'bold',
          color: '#d72660',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {icon && <span style={{ fontSize: 18 }}>{icon}</span>}
          {title}
        </span>
        <button
          disabled
          style={{
            background: '#ff69b4',
            color: 'white',
            border: 'none',
            borderRadius: 2,
            width: 24,
            height: 24,
            fontWeight: 'bold',
            fontSize: 16,
            cursor: 'not-allowed',
            marginLeft: 8,
            opacity: 0.5,
          }}
        >
          ×
        </button>
      </div>
      <div style={{ padding: 20 }}>{children}</div>
    </div>
  );
} 