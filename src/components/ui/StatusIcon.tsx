import React from 'react';
import { IconCheck, IconAlert } from './icons';

interface StatusIconProps {
  status: boolean | 'error' | null;
}

export function StatusIcon({ status }: StatusIconProps) {
  if (status === true) {
    return (
      <span className="w-5 h-5 rounded-full bg-ok text-white grid place-items-center">
        <IconCheck size={12} stroke={3} />
      </span>
    );
  }
  if (status === 'error') {
    return (
      <span className="w-5 h-5 rounded-full bg-warn text-white grid place-items-center">
        <IconAlert size={12} stroke={2.5} />
      </span>
    );
  }
  return (
    <span className="w-5 h-5 rounded-full border-2 hairline-strong grid place-items-center bg-white" />
  );
}

export default StatusIcon;
