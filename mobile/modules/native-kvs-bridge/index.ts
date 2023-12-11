// Import the native module. On web, it will be resolved to NativeKvsBridge.web.ts
// and on native platforms to NativeKvsBridge.ts
import NativeKvsBridgeModule from './src/NativeKvsBridgeModule';
import NativeKvsBridgeView from './src/NativeKvsBridgeView';

export async function getInt(key: string): Promise<number> {
  return await NativeKvsBridgeModule.sharedPreferenceGetInt(key);
}

export async function getString(key: string): Promise<string> {
  return await NativeKvsBridgeModule.sharedPreferenceGetString(key);
}

export { NativeKvsBridgeView };
