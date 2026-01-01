import { Upload } from "lucide-react";
const labelStyle = {
  display: 'block',
  color: '#374151',
  fontSize: '14px',
  fontWeight: '500',
  marginBottom: '8px'
};

const buttonStyle = (bg = '#0d9488', disabled = false) => ({
  padding: '8px 16px',
  backgroundColor: bg,
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: disabled ? 'not-allowed' : 'pointer',
  opacity: disabled ? 0.5 : 1,
  transition: 'background-color 0.3s'
});
export const ImageUpload = ({ preview, label, isLoading, onChange, buttonLabel }) => (
  <div style={{ marginBottom: '24px' }}>
    <label style={labelStyle}>{label}</label>
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{ width: '96px', height: '96px', borderRadius: '50%', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {preview ? <img src={preview} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Upload style={{ color: '#9ca3af' }} size={32} />}
      </div>
      <div style={{ flex: 1 }}>
        <input type="file" id={label} accept="image/*" onChange={onChange} disabled={isLoading} style={{ display: 'none' }} />
        <label htmlFor={label} style={{ ...buttonStyle('#0d9488', isLoading), display: 'inline-block' }} onMouseEnter={(e) => !isLoading && (e.target.style.backgroundColor = '#0f766e')} onMouseLeave={(e) => !isLoading && (e.target.style.backgroundColor = '#0d9488')}>
          {isLoading ? "Uploading..." : buttonLabel}
        </label>
        <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>JPG, PNG (max 5MB)</p>
      </div>
    </div>
  </div>
);
