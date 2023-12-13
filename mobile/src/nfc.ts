import useSWR from "swr";
import { getInt, getString } from "../modules/native-kvs-bridge";

export async function lastUpdateDate(): Promise<string> {
  return getString("last_nfc_update_date");
}

export async function lastRemainCredit(): Promise<number> {
  return getInt("last_nfc_remain_credit");
}

export function useLastUpdateDate() {
  return useSWR("last_nfc_update_date", lastUpdateDate, {refreshInterval: 1000});
}

export function useLastRemainCredit() {
  return useSWR("last_nfc_remain_credit", lastRemainCredit, {refreshInterval: 1000});
}
