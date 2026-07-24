package com.wireguard.nativemobile

import android.content.Intent
import android.net.VpnService
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity

class WireGuardVpnService : VpnService() {

    private var vpnInterface: ParcelFileDescriptor? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val action = intent?.action
        if (action == "CONNECT") {
            val serverIp = intent.getStringExtra("SERVER_IP") ?: "91.186.220.107"
            startVpn(serverIp)
        } else if (action == "DISCONNECT") {
            stopVpn()
        }
        return START_STICKY
    }

    private fun startVpn(serverIp: String) {
        try {
            val builder = Builder()
                .setSession("WireGuardNativeTunnel")
                .addAddress("10.8.0.2", 32)
                .addDnsServer("1.1.1.1")
                .addRoute("0.0.0.0", 0)
                .setMtu(1420)

            vpnInterface = builder.establish()
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    private fun stopVpn() {
        try {
            vpnInterface?.close()
            vpnInterface = null
            stopSelf()
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    override fun onDestroy() {
        stopVpn()
        super.onDestroy()
    }
}
