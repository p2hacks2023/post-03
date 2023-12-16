export function getLastSuicaUpdateDate(): Promise<string> {
  return new Promise((resolve, reject) => {
    cordova.exec(
      resolve,
      reject,
      "BosomNfcPlugin",
      "get_last_suica_update_date",
    );
  });
}

export function getLastSuicaRemainCredit(): Promise<number> {
  return new Promise((resolve, reject) => {
    cordova.exec(resolve, reject, "BosomNfcPlugin", "get_last_suica_remain_credit");
  });
}
