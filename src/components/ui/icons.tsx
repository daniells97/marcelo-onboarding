import React from 'react';

interface IProps {
  d: React.ReactNode;
  size?: number;
  stroke?: number | string;
  fill?: string;
  className?: string;
}

const I: React.FC<IProps> = ({ d, size = 18, stroke = 1.5, fill = 'none', className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke={stroke === 'none' ? 'none' : 'currentColor'}
    strokeWidth={stroke === 'none' ? undefined : (stroke as number)}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {d}
  </svg>
);

type IconProps = { size?: number; stroke?: number | string; className?: string; fill?: string; };

export const IconCheck = (p: IconProps) => <I {...p} d={<polyline points="4 12 10 18 20 6" />} />;
export const IconCircle = (p: IconProps) => <I {...p} d={<circle cx="12" cy="12" r="8" />} />;
export const IconAlert = (p: IconProps) => <I {...p} d={<><path d="M12 3 2 20h20L12 3z"/><path d="M12 10v5"/><circle cx="12" cy="18" r=".6" fill="currentColor" stroke="none"/></>} />;
export const IconArrowRight = (p: IconProps) => <I {...p} d={<><line x1="4" y1="12" x2="20" y2="12"/><polyline points="14 6 20 12 14 18"/></>} />;
export const IconArrowLeft = (p: IconProps) => <I {...p} d={<><line x1="20" y1="12" x2="4" y2="12"/><polyline points="10 18 4 12 10 6"/></>} />;
export const IconChevDown = (p: IconProps) => <I {...p} d={<polyline points="6 9 12 15 18 9" />} />;
export const IconPlay = (p: IconProps) => <I {...p} fill="currentColor" stroke="none" d={<polygon points="7 5 19 12 7 19 7 5" />} />;
export const IconMail = (p: IconProps) => <I {...p} d={<><rect x="3" y="5" width="18" height="14" rx="2"/><polyline points="3 7 12 13 21 7"/></>} />;
export const IconWhats = (p: IconProps) => <I {...p} d={<><path d="M4 20l1.5-4A8 8 0 1 1 9 20H4z"/><path d="M9 10.5c.5 2 2 3.5 4 4l1.2-1.2c.3-.3.7-.4 1-.2l1.6.8c.4.2.6.6.4 1-.5 1.4-2 2.1-3.6 1.6-2.8-.7-5-2.9-5.7-5.7-.5-1.6.2-3.1 1.6-3.6.4-.2.8 0 1 .4l.8 1.6c.2.3.1.7-.2 1L9 10.5z"/></>} />;
export const IconShare = (p: IconProps) => <I {...p} d={<><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M8 13v3"/><path d="M12 10v6"/><path d="M16 7v9"/></>} />;
export const IconGlobe = (p: IconProps) => <I {...p} d={<><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.8 3 2.8 15 0 18"/><path d="M12 3c-2.8 3-2.8 15 0 18"/></>} />;
export const IconFile = (p: IconProps) => <I {...p} d={<><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z"/><polyline points="14 3 14 8 19 8"/></>} />;
export const IconEdit = (p: IconProps) => <I {...p} d={<><path d="M4 20h4l11-11-4-4L4 16v4z"/><path d="M14 6l4 4"/></>} />;
export const IconX = (p: IconProps) => <I {...p} d={<><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></>} />;
export const IconClock = (p: IconProps) => <I {...p} d={<><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 16 14"/></>} />;
export const IconUpload = (p: IconProps) => <I {...p} d={<><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/><polyline points="8 8 12 4 16 8"/><line x1="12" y1="4" x2="12" y2="16"/></>} />;
export const IconSpark = (p: IconProps) => <I {...p} d={<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z"/>} />;
