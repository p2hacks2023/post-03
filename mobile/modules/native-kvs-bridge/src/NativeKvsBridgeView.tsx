import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { NativeKvsBridgeViewProps } from './NativeKvsBridge.types';

const NativeView: React.ComponentType<NativeKvsBridgeViewProps> =
  requireNativeViewManager('NativeKvsBridge');

export default function NativeKvsBridgeView(props: NativeKvsBridgeViewProps) {
  return <NativeView {...props} />;
}
