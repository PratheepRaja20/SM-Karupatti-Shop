import SMLogoImg from '../assets/sm-logo.png';

/**
 * SM Original Karupatti — Circular Logo Component
 * Uses overflow:hidden on wrapper to guarantee circle clip in all browsers.
 */
export default function SMLogoCircle({ size = 52, shadow = true, style = {} }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        border: '2px solid rgba(212,160,23,0.4)',
        boxShadow: shadow ? '0 4px 16px rgba(92,51,23,0.18)' : 'none',
        background: 'white',
        flexShrink: 0,
        display: 'inline-block',
        ...style,
      }}
    >
      <img
        src={SMLogoImg}
        alt="SM Original Karupatti"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    </div>
  );
}
