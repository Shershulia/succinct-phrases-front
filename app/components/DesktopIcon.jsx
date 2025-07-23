export default function DesktopIcon({ icon, label, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
        width: 80,
        margin: 16,
        userSelect: 'none',
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          background: '#ffe4ef',
          border: '2px solid #ff69b4',
          boxShadow: '2px 2px 0 #ff69b4',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 32,
          marginBottom: 6,
        }}
      >
        {icon}
      </div>
      <span
        style={{
          fontFamily: 'MS Sans Serif',
          fontSize: 13,
          color: '#d72660',
          textAlign: 'center',
          textShadow: '1px 1px 0 #fff',
        }}
      >
        {label}
      </span>
    </div>
  );
} 