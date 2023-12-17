package com.superneko.sexydynamite.bosom.nativekvsbridge

import android.content.Context
import android.content.SharedPreferences
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class NativeKvsBridgeModule : Module() {
  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  override fun definition() = ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('NativeKvsBridge')` in JavaScript.
    Name("NativeKvsBridge")

    // Sets constant properties on the module. Can take a dictionary or a closure that returns a dictionary.
    /*Constants(
      "PI" to Math.PI
    )

    // Defines event names that the module can send to JavaScript.
    Events("onChange")

    // Defines a JavaScript synchronous function that runs the native code on the JavaScript thread.
    Function("hello") {
      "Hello world! 👋"
    }*/

    // Defines a JavaScript function that always returns a Promise and whose native code
    // is by default dispatched on the different thread than the JavaScript runtime runs on.
    /*AsyncFunction("setValueAsync") { value: String ->
      // Send an event to JavaScript.
      sendEvent("onChange", mapOf(
        "value" to value
      ))
    }*/

    /*Function("getNfcDate") {
      getPreferences().getString("date", "INVALID")
    }

    Function("getRemain") {
      getPreferences().getInt("lastremain", 9999)
    }*/

    Function("sharedPreferenceGetInt") { key: String -> 
      return@Function getPreferences().getInt(key, 0)
    }

    Function("sharedPreferenceGetString") { key: String ->
      return@Function getPreferences().getString(key, "");
    }

    // Enables the module to be used as a native view. Definition components that are accepted as part of
    // the view definition: Prop, Events.
    /*View(NativeKvsBridgeView::class) {
      // Defines a setter for the `name` prop.
      Prop("name") { view: NativeKvsBridgeView, prop: String ->
        println(prop)
      }
    }*/
  }

  private val context
  get() = requireNotNull(appContext.reactContext)

  private fun getPreferences(): SharedPreferences {
    return context.getSharedPreferences("com.superneko.sexydynamite.bosom.kvs", Context.MODE_PRIVATE)
  }
}
