package com.wireguard.nativemobile

import android.content.Intent
import android.net.VpnService
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Запрос разрешения VpnService
        val intent = VpnService.prepare(this)
        if (intent != null) {
            startActivityForResult(intent, 101)
        } else {
            startVpnService("91.186.220.107")
        }
    }

    private fun startVpnService(serverIp: String) {
        val intent = Intent(this, WireGuardVpnService::class.java).apply {
            action = "CONNECT"
            putExtra("SERVER_IP", serverIp)
        }
        startService(intent)
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == 101 && resultCode == RESULT_OK) {
            startVpnService("91.186.220.107")
        }
    }
}
