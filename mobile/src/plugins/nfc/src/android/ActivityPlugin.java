package com.superneko.sexydynamite.bosom.plugin.nfc;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.nfc.NfcAdapter;
import android.nfc.tech.NfcF;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.util.Log;
import java.nio.ByteBuffer;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Objects;
import org.json.JSONArray;
import org.json.JSONException;
import org.apache.cordova.*;

public class ActivityPlugin extends CordovaPlugin {

  private static final String TAG = "MainActivity";
  private Activity activity;
  private Intent currentIntent;

  @Override
  public void initialize(CordovaInterface cordova, CordovaWebView webView) {
    Log.d(TAG, "[Plugin] initialize called");
    super.initialize(cordova, webView);

    activity = cordova.getActivity();
  }

  @Override
  public void onStart() {
    super.onStart();
    this.currentIntent = activity.getIntent();
    updateSuicaInformation();
  }

  @Override
  public void onNewIntent(Intent intent) {
    this.currentIntent = intent;
    updateSuicaInformation();
    super.onNewIntent(intent);
  }

  @Override
  public boolean execute(
    String action,
    JSONArray args,
    CallbackContext callbackContext
  ) throws JSONException {
    if (action.equals("get_last_suica_update_date")) {
			callbackContext.success(getSharedPreferences().getString("last_suica_update_date", ""));
      return true;
    } else if (action.equals("get_last_suica_remain_credit")) {
			callbackContext.success(String.valueOf(getSharedPreferences().getInt("last_suica_remain_credit", 0)));
			return true;
		}
    return false;
  }

  private void updateSuicaInformation() {
		try {
			Log.d(TAG, "updateSuicaInformation");

			Intent intent = currentIntent;
	
			if (!Objects.nonNull(intent)) {
				return;
			}
	
			Log.d(TAG, "Non-null intent check ok");
			if (NfcAdapter.ACTION_TECH_DISCOVERED.equals(intent.getAction())) {
				SharedPreferences.Editor preference = getSharedPreferences().edit();
	
				Log.d(TAG, "Start reading suica tag");
	
				SuicaInformation suicaInformation = this.extractSuicaInformation(intent);
	
				Log.d(TAG, "End of reading suica tag");
				Log.d(
					TAG,
					"Last readed history log length: " + suicaInformation.history.size()
				);
	
				preference.putInt(
					"last_suica_remain_credit",
					suicaInformation.history.get(0).getRemain()
				);
				preference.putString(
					"last_suica_update_date",
					new SimpleDateFormat("yyyy/MM/dd HH:mm:ss").format(new Date())
				);
	
				preference.commit();
			} else {
				Log.d(TAG, "Intent was not Nfc tag.");
			}
	
		} catch(Throwable t) {
			// GO TO HELL
			Log.e(TAG, "Something went wrong while read nfc.");
		}
  }

  private SuicaInformation extractSuicaInformation(Intent intent) {
    return SuicaInformation.fromIntent(intent);
  }

  private SharedPreferences getSharedPreferences() {
    return activity
      .getApplicationContext()
      .getSharedPreferences(
        "com.superneko.sexydynamite.bosom.kvs",
        Context.MODE_PRIVATE
      );
  }
}
