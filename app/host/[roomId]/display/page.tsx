'use client';

import { useParams } from 'next/navigation';
import BigScreenDisplay from '../../../../frontend/components/BigScreenDisplay';

export default function BigScreenDisplayPage() {
  const params = useParams();
  const roomId = params.roomId as string;

  return <BigScreenDisplay roomId={roomId} />;
}
