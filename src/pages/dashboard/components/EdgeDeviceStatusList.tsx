import { Tag, Intent } from '@blueprintjs/core';
import type { DeviceStatus, DeviceStatusType } from '@/types';
import { StatusDot } from '@/components/shared/StatusDot';
import { DashboardSectionUnavailable } from './DashboardSectionUnavailable';

interface EdgeDeviceStatusListProps {
  devices: DeviceStatus[] | undefined;
  isLoading: boolean;
  isError?: boolean;
}

const STATUS_LABEL: Record<DeviceStatusType, string> = {
  online: 'Online',
  offline: 'Disconnected',
  warning: 'Warning',
};

const STATUS_INTENT: Record<DeviceStatusType, Intent> = {
  online: Intent.SUCCESS,
  offline: Intent.DANGER,
  warning: Intent.WARNING,
};

export function EdgeDeviceStatusList({ devices, isLoading, isError }: EdgeDeviceStatusListProps) {
  if (isLoading) {
    return (
      <ul className="device-list">
        {Array.from({ length: 4 }).map((_, i) => (
          <li key={i} className="device-item">
            <div className="bp6-skeleton" style={{ height: 14, width: '70%', marginBottom: 6 }} />
            <div className="bp6-skeleton" style={{ height: 11, width: '50%' }} />
          </li>
        ))}
      </ul>
    );
  }

  if (isError || !devices) {
    return <DashboardSectionUnavailable height={180} />;
  }

  if (devices.length === 0) {
    return <div className="device-list-empty">등록된 디바이스가 없습니다.</div>;
  }

  return (
    <ul className="device-list">
      {devices.map((device) => (
        <li key={device.name} className="device-item">
          <div className="device-item-left">
            <StatusDot status={device.status} />
            <div className="device-item-text">
              <div className="device-item-name">{device.name}</div>
              <div className="device-item-type">{device.type}</div>
            </div>
          </div>
          <Tag minimal round intent={STATUS_INTENT[device.status]}>
            {STATUS_LABEL[device.status]}
          </Tag>
        </li>
      ))}
    </ul>
  );
}
