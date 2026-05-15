import React from 'react';

export function SkeletonChecklist() {
  return (
    <div className="space-y-10">
      {[1, 2, 3, 4].map(i => (
        <div key={i}>
          <div className="skeleton h-4 w-40 mb-4" />
          <div className="skeleton h-24 w-full rounded-xl" />
        </div>
      ))}
    </div>
  );
}

export default SkeletonChecklist;
