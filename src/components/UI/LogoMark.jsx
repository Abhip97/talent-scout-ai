import { motion } from 'framer-motion';

/**
 * TalentScout AI logo mark — radar/neural crosshair design.
 *
 * Props:
 *   size      — total outer px (default 36)
 *   isDark    — color scheme
 *   animated  — enables rotating scan beam + pulsing rings
 *   className — extra wrapper classes
 */
export const LogoMark = ({ size = 36, isDark = true, animated = false, className = '' }) => {
  const r = size / 2;           // outer radius
  const s = size;               // viewBox size

  /* gradient / color tokens */
  const fromColor = isDark ? '#f97316' : '#6366f1';
  const toColor   = isDark ? '#ea580c' : '#7c3aed';
  const ringColor = isDark ? 'rgba(249,115,22,0.25)' : 'rgba(99,102,241,0.20)';
  const crossColor= isDark ? 'rgba(249,115,22,0.55)' : 'rgba(99,102,241,0.55)';
  const nodeColor = isDark ? '#fb923c' : '#818cf8';
  const centerColor = '#ffffff';
  const scanColor = isDark ? 'rgba(251,191,36,0.55)' : 'rgba(139,92,246,0.55)';

  /* relative positions inside the s×s viewBox */
  const cx = r;
  const cy = r;
  const outerRingR = r * 0.82;
  const midRingR   = r * 0.56;
  const crossLen   = r * 0.78;
  const nodeR      = r * 0.10;
  const centerR    = r * 0.14;

  /* 8 node positions — 4 on cross arms + 4 diagonal */
  const nodes = [
    { x: cx,                    y: cy - crossLen },  // top
    { x: cx + crossLen,         y: cy },             // right
    { x: cx,                    y: cy + crossLen },  // bottom
    { x: cx - crossLen,         y: cy },             // left
    { x: cx + midRingR * 0.68,  y: cy - midRingR * 0.68 }, // NE
    { x: cx + midRingR * 0.68,  y: cy + midRingR * 0.68 }, // SE
    { x: cx - midRingR * 0.68,  y: cy + midRingR * 0.68 }, // SW
    { x: cx - midRingR * 0.68,  y: cy - midRingR * 0.68 }, // NW
  ];

  /* diagonal connector lines (inner diamond) */
  const diags = [
    [nodes[4], nodes[5]],
    [nodes[5], nodes[6]],
    [nodes[6], nodes[7]],
    [nodes[7], nodes[4]],
  ];

  const bgGrad = `linear-gradient(135deg, ${fromColor}, ${toColor})`;
  const borderRadius = size * 0.28;

  return (
    <div
      className={`relative shrink-0 flex items-center justify-center ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius,
        background: bgGrad,
        boxShadow: animated
          ? `0 0 ${size * 0.55}px ${fromColor}55, 0 ${size * 0.12}px ${size * 0.35}px ${fromColor}30`
          : `0 ${size * 0.06}px ${size * 0.22}px ${fromColor}40`,
      }}
    >
      {/* Outer glow pulse ring (animated only) */}
      {animated && (
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{ width: size * 1.25, height: size * 1.25, borderRadius: size * 0.35,
            border: `1.5px solid ${ringColor}` }}
          animate={{ scale: [1, 1.18, 1], opacity: [0.7, 0, 0.7] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      <svg
        width={size * 0.72}
        height={size * 0.72}
        viewBox={`0 0 ${s} ${s}`}
        fill="none"
        style={{ overflow: 'visible' }}
      >
        {/* Outer ring */}
        <circle cx={cx} cy={cy} r={outerRingR} stroke="rgba(255,255,255,0.25)" strokeWidth={s * 0.025} />

        {/* Mid ring */}
        <circle cx={cx} cy={cy} r={midRingR} stroke="rgba(255,255,255,0.18)" strokeWidth={s * 0.018} strokeDasharray={`${s * 0.08} ${s * 0.04}`} />

        {/* Cross arms */}
        <line x1={cx} y1={cy - crossLen} x2={cx} y2={cy + crossLen}
          stroke="rgba(255,255,255,0.45)" strokeWidth={s * 0.025} />
        <line x1={cx - crossLen} y1={cy} x2={cx + crossLen} y2={cy}
          stroke="rgba(255,255,255,0.45)" strokeWidth={s * 0.025} />

        {/* Inner diamond connectors */}
        {diags.map(([a, b], i) => (
          <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
            stroke="rgba(255,255,255,0.20)" strokeWidth={s * 0.015} />
        ))}

        {/* Nodes */}
        {nodes.map((n, i) => (
          <circle key={i} cx={n.x} cy={n.y} r={nodeR}
            fill={i < 4 ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.50)'}
          />
        ))}

        {/* Gradient def for scan beam */}
        {animated && (
          <defs>
            <radialGradient
              id={`scanGrad-${size}`}
              gradientUnits="userSpaceOnUse"
              cx={cx} cy={cy} r={outerRingR * 1.05}
            >
              <stop offset="0%"   stopColor="rgba(255,255,255,0.0)" />
              <stop offset="30%"  stopColor="rgba(255,255,255,0.30)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.0)" />
            </radialGradient>
          </defs>
        )}

        {/* Rotating scan beam (animated only) — pie wedge */}
        {animated && (
          <motion.g
            style={{ transformOrigin: `${cx}px ${cy}px` }}
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          >
            <path
              d={`M ${cx} ${cy} L ${cx + outerRingR * 1.05} ${cy} A ${outerRingR * 1.05} ${outerRingR * 1.05} 0 0 0 ${
                (cx + outerRingR * 1.05 * Math.cos(-Math.PI / 7)).toFixed(3)
              } ${(cy + outerRingR * 1.05 * Math.sin(-Math.PI / 7)).toFixed(3)} Z`}
              fill={`url(#scanGrad-${size})`}
              opacity={0.8}
            />
          </motion.g>
        )}

        {/* Center target dot */}
        <circle cx={cx} cy={cy} r={centerR * 1.6} fill="rgba(255,255,255,0.18)" />
        <circle cx={cx} cy={cy} r={centerR} fill="white" />
        {animated && (
          <motion.circle
            cx={cx} cy={cy} r={centerR * 2.2}
            fill="none"
            stroke="rgba(255,255,255,0.45)"
            strokeWidth={s * 0.018}
            animate={{ r: [centerR * 1.8, centerR * 3.2, centerR * 1.8], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
      </svg>
    </div>
  );
};

export default LogoMark;
