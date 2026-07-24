package com.wireguard.nativemobile

import android.Manifest
import android.app.Activity
import android.content.Context
import android.content.Intent
import android.net.VpnService
import android.os.Build
import android.os.Bundle
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.core.app.ActivityCompat

class MainActivity : Activity() {
    private lateinit var webView: WebView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            ActivityCompat.requestPermissions(this, arrayOf(Manifest.permission.POST_NOTIFICATIONS), 12)
        }

        webView = WebView(this).apply {
            settings.javaScriptEnabled = true
            settings.domStorageEnabled = true
            settings.cacheMode = WebSettings.LOAD_DEFAULT
            webViewClient = WebViewClient()
            webChromeClient = WebChromeClient()
            addJavascriptInterface(NativeVpnBridge(this@MainActivity), "WireGuardNative")
            loadUrl("file:///android_asset/www/index.html")
        }

        setContentView(webView)
    }

    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }

    class NativeVpnBridge(private val context: Context) {
        @JavascriptInterface
        fun prepareVpn(): String {
            val intent = VpnService.prepare(context)
            if (intent != null && context is Activity) {
                context.startActivityForResult(intent, VPN_PERMISSION_REQUEST)
                return "permission_required"
            }
            return "ready"
        }

        @JavascriptInterface
        fun startVpn(config: String): String {
            val intent = Intent(context, WireGuardVpnService::class.java)
                .setAction(WireGuardVpnService.ACTION_START)
                .putExtra(WireGuardVpnService.EXTRA_CONFIG, config)
            context.startService(intent)
            return "starting"
        }

        @JavascriptInterface
        fun stopVpn(): String {
            val intent = Intent(context, WireGuardVpnService::class.java)
                .setAction(WireGuardVpnService.ACTION_STOP)
            context.startService(intent)
            return "stopping"
        }
    }

    companion object {
        private const val VPN_PERMISSION_REQUEST = 1001
    }
}
