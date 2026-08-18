import React from 'react';
import { getStatusBadgeClass } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const badgeClass = getStatusBadgeClass(status);

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-semibold',
    lg: 'px-3 py-1.5 text-sm font-semibold',
  };

  const readableLabels: Record<string, string> = {
    PENDING: 'Pending',
    CONFIRMED: 'Confirmed',
    ARRIVED: 'Arrived',
    SERVICE_STARTED: 'Service Started',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
    NO_SHOW: 'No Show',
    ACTIVE: 'Active',
    SUSPENDED: 'Suspended',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border shadow-sm ${badgeClass} ${sizeClasses[size]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {readableLabels[status] || status}
    </span>
  );
};
