package com.wireguard.nativemobile

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Intent
import android.net.VpnService
import android.os.Build
import android.os.ParcelFileDescriptor

class WireGuardVpnService : VpnService() {
    private var tunnelInterface: ParcelFileDescriptor? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        when (intent?.action) {
            ACTION_START -> startTunnel(intent.getStringExtra(EXTRA_CONFIG).orEmpty())
            ACTION_STOP -> stopTunnel()
        }
        return START_STICKY
    }

    override fun onDestroy() {
        stopTunnel()
        super.onDestroy()
    }

    private fun startTunnel(config: String) {
        startForeground(NOTIFICATION_ID, buildNotification())

        if (tunnelInterface != null) return

        tunnelInterface = Builder()
            .setSession("WireGuard Native")
            .addAddress("10.8.0.2", 32)
            .addDnsServer("1.1.1.1")
            .addRoute("0.0.0.0", 0)
            .establish()

        // TODO: Hand the parsed WireGuard config to the native tunnel backend.
        config.takeIf { it.isNotBlank() }
    }

    private fun stopTunnel() {
        tunnelInterface?.close()
        tunnelInterface = null
        stopForeground(STOP_FOREGROUND_REMOVE)
        stopSelf()
    }

    private fun buildNotification(): Notification {
        val channelId = "wireguard_vpn"
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(
                NotificationChannel(channelId, "WireGuard VPN", NotificationManager.IMPORTANCE_LOW)
            )
        }

        val launchIntent = packageManager.getLaunchIntentForPackage(packageName)
        val pendingIntent = PendingIntent.getActivity(
            this,
            0,
            launchIntent,
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )

        return Notification.Builder(this, channelId)
            .setSmallIcon(R.drawable.ic_vpn_key)
            .setContentTitle("WireGuard Native")
            .setContentText("VPN tunnel is active")
            .setContentIntent(pendingIntent)
            .setOngoing(true)
            .build()
    }

    companion object {
        const val ACTION_START = "com.wireguard.nativemobile.START"
        const val ACTION_STOP = "com.wireguard.nativemobile.STOP"
        const val EXTRA_CONFIG = "wireguard_config"
        private const val NOTIFICATION_ID = 42
    }
}
