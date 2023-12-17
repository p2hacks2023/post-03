import * as React from 'react';

import { NativeKvsBridgeViewProps } from './NativeKvsBridge.types';

export default function NativeKvsBridgeView(props: NativeKvsBridgeViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}
