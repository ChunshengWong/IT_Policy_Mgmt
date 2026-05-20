interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    draft: { label: '草稿', className: 'bg-gray-100 text-gray-600' },
    active: { label: '生效', className: 'bg-green-100 text-green-600' },
    pending: { label: '待审核', className: 'bg-yellow-100 text-yellow-600' },
    completed: { label: '已完成', className: 'bg-green-100 text-green-600' },
    rejected: { label: '已拒绝', className: 'bg-red-100 text-red-600' },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || {
    label: status,
    className: 'bg-gray-100 text-gray-600',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}
