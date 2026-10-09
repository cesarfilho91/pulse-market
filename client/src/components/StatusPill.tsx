import { Radio } from 'lucide-react';
import type { FeedStatus } from '../types/market';

const LABELS: Record<FeedStatus, string> = {
  connecting: 'Conectando', connected: 'Ao vivo', reconnecting: 'Reconectando', offline: 'Offline',
};

export function StatusPill({ status }: { status: FeedStatus }) {
  return (
    <span className={`status-pill status-${status}`}>
      <span className="status-dot" />
      <Radio size={13} strokeWidth={2.2} />
      {LABELS[status]}
    </span>
  );
}
