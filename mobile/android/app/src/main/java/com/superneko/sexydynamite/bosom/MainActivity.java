package com.superneko.sexydynamite.bosom;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.nfc.NfcAdapter;
import android.nfc.tech.NfcF;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;

import java.nio.ByteBuffer;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Objects;

import expo.modules.ReactActivityDelegateWrapper;

public class MainActivity extends ReactActivity {
  private static final String TAG = "MainActivity";
  private Intent currentIntent;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    // Set the theme to AppTheme BEFORE onCreate to support 
    // coloring the background, status bar, and navigation bar.
    // This is required for expo-splash-screen.
    setTheme(R.style.AppTheme);
    super.onCreate(null);
  }

  @Override
  protected void onStart() {
    super.onStart();
    this.currentIntent = getIntent();
    updateSuicaInformation();
  }

  /**
   * Returns the name of the main component registered from JavaScript.
   * This is used to schedule rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "main";
  }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. Here we use a util class {@link
   * DefaultReactActivityDelegate} which allows you to easily enable Fabric and Concurrent React
   * (aka React 18) with two boolean flags.
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new ReactActivityDelegateWrapper(this, BuildConfig.IS_NEW_ARCHITECTURE_ENABLED, new DefaultReactActivityDelegate(
        this,
        getMainComponentName(),
        // If you opted-in for the New Architecture, we enable the Fabric Renderer.
        DefaultNewArchitectureEntryPoint.getFabricEnabled()));
  }

  /**
   * Align the back button behavior with Android S
   * where moving root activities to background instead of finishing activities.
   * @see <a href="https://developer.android.com/reference/android/app/Activity#onBackPressed()">onBackPressed</a>
   */
  @Override
  public void invokeDefaultOnBackPressed() {
    if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.R) {
      if (!moveTaskToBack(false)) {
        // For non-root activities, use the default implementation to finish them.
        super.invokeDefaultOnBackPressed();
      }
      return;
    }

    // Use the default back button implementation on Android S
    // because it's doing more than {@link Activity#moveTaskToBack} in fact.
    super.invokeDefaultOnBackPressed();
  }

  @Override
  public void onNewIntent(Intent intent) {
    updateSuicaInformation();
    this.currentIntent = intent;
    setIntent(intent);
    super.onNewIntent(intent);
  }

  private void updateSuicaInformation() {
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
      Log.d(TAG, "Last readed history log length: " + suicaInformation.history.size());

      preference.putInt("lastremain", suicaInformation.history.get(0).getRemain());
      preference.putString("date", new SimpleDateFormat("yyyy/MM/dd HH:mm:ss").format(new Date()));

      preference.commit();

      super.onNewIntent(intent);
    } else {
      Log.d(TAG, "Intent was not Nfc tag.");
    }
  }

  private SuicaInformation extractSuicaInformation(Intent intent) {
    return SuicaInformation.fromIntent(intent);
  }

  private SharedPreferences getSharedPreferences() {
    return getApplicationContext().getSharedPreferences("com.superneko.sexydynamite.bosom.kvs", Context.MODE_PRIVATE);
  }
}
