// Inline hero Earth — no fixed positioning, scales with the flex layout
export default function Earth() {
  return (
    <div
      style={{
        flexShrink:  0,
        borderRadius:'50%',
        overflow:    'hidden',
        // Seamlessly shrinks as viewport narrows; caps at 260px on wide screens
        width:       'clamp(72px, 18vw, 260px)',
        aspectRatio: '1 / 1',
      }}
    >
      <img
        src="/earth.jpg"
        alt=""
        style={{
          display:   'block',
          width:     '100%',
          height:    '100%',
          objectFit: 'cover',
          // Zoom in ~18% so the black edges of the photo fall outside the circle
          transform: 'scale(1.18)',
        }}
      />
    </div>
  )
}
