import React, { useState } from 'react';
import { X, Smartphone, Shield, Download, CheckCircle, ExternalLink, Cpu, Info, Zap, AlertTriangle, Apple, Code2, Layers, Rocket, ChevronDown } from 'lucide-react';

interface PlatformGuideModalProps {
  onClose: () => void;
  initialPlatform?: 'ios' | 'android' | 'desktop';
}

export const PlatformGuideModal: React.FC<PlatformGuideModalProps> = ({ onClose, initialPlatform = 'ios' }) => {
  const [activeTab, setActiveTab] = useState<'android' | 'ios' | 'architecture' | 'production'>('production');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Шапка */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <Smartphone className="w-5 h-5 text-sky-400" />
            <div>
              <h2 className="text-base font-bold text-white">Инструкции Сборки и Выкатки Приложения</h2>
              <p className="text-xs text-slate-400">
                Все инструкции спрятаны под кат. Нажмите на любой раздел, чтобы развернуть детали.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Выбор платформы */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 p-2 gap-2 overflow-x-auto custom-scrollbar">
          <button
            onClick={() => setActiveTab('production')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0 ${
              activeTab === 'production' ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Rocket className="w-4 h-4 text-amber-300" />
            <span>Выкатка в Прод (Google Play & App Store)</span>
          </button>

          <button
            onClick={() => setActiveTab('android')}
            className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0 ${
              activeTab === 'android' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Smartphone className="w-4 h-4 text-emerald-300" />
            <span>Android (APK)</span>
          </button>

          <button
            onClick={() => setActiveTab('ios')}
            className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0 ${
              activeTab === 'ios' ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Apple className="w-4 h-4" />
            <span>iOS (Xcode)</span>
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0 ${
              activeTab === 'architecture' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-4 h-4 text-indigo-300" />
            <span>Нативный Мост</span>
          </button>
        </div>

        {/* Содержимое вкладки */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-slate-300 text-xs leading-relaxed custom-scrollbar">
          
          {activeTab === 'production' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 space-y-1">
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <Rocket className="w-4 h-4 text-amber-400" />
                  Руководство по релизу WireGuard VPN в Продакшен
                </h4>
                <p>
                  Кжмите на интересующий блок ниже, чтобы раскрыть подробные пошаговые инструкции под катом.
                </p>
              </div>

              {/* Блок 1: Android Google Play (Под кат) */}
              <details className="group rounded-xl bg-slate-950 border border-slate-800 overflow-hidden transition-all">
                <summary className="flex items-center justify-between p-4 cursor-pointer font-bold text-emerald-400 text-sm hover:bg-slate-900/80 transition-colors select-none list-none">
                  <span className="flex items-center gap-2">
                    <span>🤖</span> 1. Релиз в Google Play Console (Android)
                  </span>
                  <span className="text-[11px] font-normal text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg flex items-center gap-1.5 group-open:hidden">
                    <span>Раскрыть под катом</span>
                    <ChevronDown className="w-3.5 h-3.5 text-emerald-400" />
                  </span>
                  <span className="text-[11px] font-normal text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg hidden group-open:inline-flex items-center gap-1.5">
                    <span>Скрыть</span>
                    <ChevronDown className="w-3.5 h-3.5 rotate-180 text-emerald-400" />
                  </span>
                </summary>

                <div className="p-4 pt-2 border-t border-slate-900 space-y-2 text-slate-300">
                  <div className="flex gap-2">
                    <span className="font-bold text-white shrink-0">Шаг 1:</span>
                    <span>Скомпилируйте <strong>Android App Bundle (.aab)</strong> в Android Studio via <code>Build &gt; Generate Signed Bundle / APK</code> с ключом подписи Release Keystore.</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold text-white shrink-0">Шаг 2:</span>
                    <span>Заполните декларацию VPN сервиса в Google Play Console: укажите, что разрешение <code>BIND_VPN_SERVICE</code> используется строго для туннелирования сетевого трафика.</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold text-white shrink-0">Шаг 3:</span>
                    <span>Опубликуйте ссылку на Privacy Policy (Политику конфиденциальности) с гарантийной формулировкой <strong>No-Logs Policy</strong> (без сохранения логов сайтов и IP).</span>
                  </div>
                </div>
              </details>

              {/* Блок 2: iOS App Store (Под кат) */}
              <details className="group rounded-xl bg-slate-950 border border-slate-800 overflow-hidden transition-all">
                <summary className="flex items-center justify-between p-4 cursor-pointer font-bold text-sky-400 text-sm hover:bg-slate-900/80 transition-colors select-none list-none">
                  <span className="flex items-center gap-2">
                    <span>🍎</span> 2. Релиз в App Store Connect & TestFlight (iOS)
                  </span>
                  <span className="text-[11px] font-normal text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg flex items-center gap-1.5 group-open:hidden">
                    <span>Раскрыть под катом</span>
                    <ChevronDown className="w-3.5 h-3.5 text-sky-400" />
                  </span>
                  <span className="text-[11px] font-normal text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg hidden group-open:inline-flex items-center gap-1.5">
                    <span>Скрыть</span>
                    <ChevronDown className="w-3.5 h-3.5 rotate-180 text-sky-400" />
                  </span>
                </summary>

                <div className="p-4 pt-2 border-t border-slate-900 space-y-2 text-slate-300">
                  <div className="flex gap-2">
                    <span className="font-bold text-white shrink-0">Шаг 1:</span>
                    <span>Запросите у Apple разрешение <strong>Network Extension Entitlement</strong> в консоли Developer Account (Apple выдает доступ к <code>com.apple.developer.networking.vpn.api</code> за 1-2 дня).</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold text-white shrink-0">Шаг 2:</span>
                    <span>В Xcode выберите схему <code>Any iOS Device</code> и запустите <code>Product &gt; Archive</code>. Нажмите <strong>Distribute App</strong> для выгрузки в App Store Connect.</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold text-white shrink-0">Шаг 3:</span>
                    <span>Отправьте сборку во внутреннее или публичное тестирование <strong>TestFlight</strong>. Пользователи смогут ставить приложение по ссылке в 1 клик.</span>
                  </div>
                </div>
              </details>

              {/* Блок 3: Серверная инфраструктура (Под кат) */}
              <details className="group rounded-xl bg-slate-950 border border-slate-800 overflow-hidden transition-all">
                <summary className="flex items-center justify-between p-4 cursor-pointer font-bold text-amber-400 text-sm hover:bg-slate-900/80 transition-colors select-none list-none">
                  <span className="flex items-center gap-2">
                    <span>🖥️</span> 3. Серверная инфраструктура нодов
                  </span>
                  <span className="text-[11px] font-normal text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg flex items-center gap-1.5 group-open:hidden">
                    <span>Раскрыть под катом</span>
                    <ChevronDown className="w-3.5 h-3.5 text-amber-400" />
                  </span>
                  <span className="text-[11px] font-normal text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg hidden group-open:inline-flex items-center gap-1.5">
                    <span>Скрыть</span>
                    <ChevronDown className="w-3.5 h-3.5 rotate-180 text-amber-400" />
                  </span>
                </summary>

                <div className="p-4 pt-2 border-t border-slate-900 space-y-2 text-slate-400">
                  <p>
                    Ваши клиенты обращаются к REST API <code>/api/nodes</code> за динамическими конфигурациями keys/peers. В продакшене серверные ноды WireGuard работают на Ubuntu с утилитой <code>wg-quick</code> и включенным IP Forwarding (<code>sysctl -w net.ipv4.ip_forward=1</code>).
                  </p>
                </div>
              </details>
            </div>
          )}

          {activeTab === 'android' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                <h4 className="font-bold text-sm mb-1 text-white flex items-center gap-2">
                  <span>🤖</span> Android: Нативная сборка через VpnService & WireGuard Android SDK
                </h4>
                <p>
                  В отличие от браузерного PWA, нативное приложение Android запускается как системный сервис <code>VpnService</code> и имеет прямое право создавать виртуальные сетевые адаптеры (TUN).
                </p>
              </div>

              {/* Инструкция Android под кат */}
              <details className="group rounded-xl bg-slate-950 border border-slate-800 overflow-hidden transition-all">
                <summary className="flex items-center justify-between p-4 cursor-pointer font-bold text-white text-sm hover:bg-slate-900/80 transition-colors select-none list-none">
                  <span className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <span>Пошаговая инструкция интеграции в Android Studio</span>
                  </span>
                  <span className="text-[11px] font-normal text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg flex items-center gap-1.5 group-open:hidden">
                    <span>Раскрыть под катом</span>
                    <ChevronDown className="w-3.5 h-3.5 text-emerald-400" />
                  </span>
                  <span className="text-[11px] font-normal text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg hidden group-open:inline-flex items-center gap-1.5">
                    <span>Скрыть</span>
                    <ChevronDown className="w-3.5 h-3.5 rotate-180 text-emerald-400" />
                  </span>
                </summary>

                <div className="p-4 pt-2 border-t border-slate-900 space-y-3">
                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 flex gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-bold text-xs shrink-0">1</span>
                    <div>
                      <h5 className="font-bold text-white mb-0.5">Скопируйте исходный код WireGuardVpnService.kt</h5>
                      <p className="text-slate-400">
                        Откройте раздел <strong className="text-emerald-400">Исходный код Native</strong> в шапке приложения и скопируйте класс <code>WireGuardVpnService.kt</code> в проект Android Studio.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 flex gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-bold text-xs shrink-0">2</span>
                    <div>
                      <h5 className="font-bold text-white mb-0.5">Добавьте разрешение BIND_VPN_SERVICE</h5>
                      <p className="text-slate-400">
                        В файле <code>AndroidManifest.xml</code> зарегистрируйте службу с разрешением <code>android.permission.BIND_VPN_SERVICE</code> и типом <code>connectedDevice</code>.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 flex gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-bold text-xs shrink-0">3</span>
                    <div>
                      <h5 className="font-bold text-white mb-0.5">Сборка APK и выгрузка на смартфон</h5>
                      <p className="text-slate-400">
                        Запустите <code>Build &gt; Build APK(s)</code> в Android Studio или соберите проект с помощью Capacitor (<code>npx cap build android</code>). Приложение сразу установится как системный клиент VPN.
                      </p>
                    </div>
                  </div>
                </div>
              </details>
            </div>
          )}

          {activeTab === 'ios' && (
            <div className="space-y-4">
              {/* Блок 1: Как обойтись без Xcode (Под кат) */}
              <details className="group rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 overflow-hidden transition-all">
                <summary className="flex items-center justify-between p-4 cursor-pointer font-bold text-sm text-white hover:bg-amber-500/20 transition-colors select-none list-none">
                  <span className="flex items-center gap-2">
                    <span>💡</span> Как обойтись БЕЗ Mac и Xcode на iOS? (4 способа под катом)
                  </span>
                  <span className="text-[11px] font-normal text-amber-300 bg-amber-950/80 border border-amber-500/40 px-2.5 py-1 rounded-lg flex items-center gap-1.5 group-open:hidden">
                    <span>Раскрыть варианты</span>
                    <ChevronDown className="w-3.5 h-3.5 text-amber-400" />
                  </span>
                  <span className="text-[11px] font-normal text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg hidden group-open:inline-flex items-center gap-1.5">
                    <span>Скрыть</span>
                    <ChevronDown className="w-3.5 h-3.5 rotate-180 text-amber-400" />
                  </span>
                </summary>

                <div className="p-4 pt-2 border-t border-amber-500/20 space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-950/90 border border-slate-800">
                    <strong className="text-amber-400">1. Установка через 1-Click Apple Profile (.mobileconfig)</strong>
                    <p className="text-slate-400 mt-0.5">
                      В этом приложении нажмите кнопку <strong>"Создать .conf / QR-код"</strong> и выберите скачивание <code>iOS MobileConfig</code>. Откройте <strong>Настройки iPhone &gt; Профиль загружен &gt; Установить</strong>. iOS настроит нативный WireGuard туннель прямо в системных настройках iOS без сторонних программ!
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950/90 border border-slate-800">
                    <strong className="text-amber-400">2. Официальный клиент WireGuard из App Store + QR-код</strong>
                    <p className="text-slate-400 mt-0.5">
                      Установите бесплатное приложение <strong>WireGuard</strong> из официального App Store. Нажмите <strong>"+" &gt; Сканировать QR-код</strong> и наведите камеру iPhone на QR-код из этого приложения.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950/90 border border-slate-800 space-y-2">
                    <strong className="text-amber-400 text-xs flex items-center gap-1.5">
                      <span>🚀</span> 3. Облачная сборка CI/CD (GitHub Actions / Codemagic) — Пошагово
                    </strong>
                    <p className="text-slate-300 text-xs">
                      Виртуальный Mac в облаке компилирует iOS приложение за вас без физического компьютера Apple:
                    </p>
                    <ol className="list-decimal list-inside space-y-1.5 text-slate-400 text-[11px] font-mono bg-slate-900/80 p-2.5 rounded-md border border-slate-800/80">
                      <li><span className="text-white font-sans">Шаг 1:</span> Создайте репозиторий в GitHub и загрузите исходники WireGuard.</li>
                      <li><span className="text-white font-sans">Шаг 2:</span> Добавьте секреты в GitHub Secrets: <code>APP_STORE_CONNECT_KEY</code>, <code>CERTIFICATE_P12</code>, <code>PROVISIONING_PROFILE</code>.</li>
                      <li><span className="text-white font-sans">Шаг 3:</span> Добавьте воркфлоу <code>.github/workflows/ios.yml</code> (использует <code>runs-on: macos-latest</code> и <code>xcodebuild</code>).</li>
                      <li><span className="text-white font-sans">Шаг 4:</span> При коммите в branch <code>main</code> GitHub Actions поднимет виртуальный Mac, скомпилирует <code>.ipa</code> и загрузит его в TestFlight!</li>
                    </ol>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950/90 border border-slate-800">
                    <strong className="text-amber-400">4. Публичная ссылка TestFlight</strong>
                    <p className="text-slate-400 mt-0.5">
                      При отправке приложения в TestFlight вы получаете публичную веб-ссылку. Пользователи переходят по ссылке со своего iPhone и устанавливают приложение в 1 клик.
                    </p>
                  </div>
                </div>
              </details>

              {/* Блок 2: Сборка через Xcode (Под кат) */}
              <details className="group rounded-xl bg-slate-950 border border-slate-800 overflow-hidden transition-all">
                <summary className="flex items-center justify-between p-4 cursor-pointer font-bold text-sky-400 text-sm hover:bg-slate-900/80 transition-colors select-none list-none">
                  <span className="flex items-center gap-2">
                    <Apple className="w-4 h-4 text-sky-400" />
                    <span>Сборка через Xcode для разработчиков (NetworkExtension)</span>
                  </span>
                  <span className="text-[11px] font-normal text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg flex items-center gap-1.5 group-open:hidden">
                    <span>Раскрыть под катом</span>
                    <ChevronDown className="w-3.5 h-3.5 text-sky-400" />
                  </span>
                  <span className="text-[11px] font-normal text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg hidden group-open:inline-flex items-center gap-1.5">
                    <span>Скрыть</span>
                    <ChevronDown className="w-3.5 h-3.5 rotate-180 text-sky-400" />
                  </span>
                </summary>

                <div className="p-4 pt-2 border-t border-slate-900 space-y-3">
                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 flex gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-sky-500 text-white font-bold text-xs shrink-0">1</span>
                    <div>
                      <h5 className="font-bold text-white mb-0.5">Добавьте NetworkExtension Target в Xcode</h5>
                      <p className="text-slate-400">
                        В Xcode создайте <code>App Extension &gt; Packet Tunnel Provider</code>. Вставьте код из вкладки <code>PacketTunnelProvider.swift</code>.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 flex gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-sky-500 text-white font-bold text-xs shrink-0">2</span>
                    <div>
                      <h5 className="font-bold text-white mb-0.5">Включите Network Extensions Capability</h5>
                      <p className="text-slate-400">
                        В свойствах проекта Xcode на вкладке <strong>Signing & Capabilities</strong> включите галочку <strong>Network Extensions &gt; Packet Tunnel</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 flex gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-sky-500 text-white font-bold text-xs shrink-0">3</span>
                    <div>
                      <h5 className="font-bold text-white mb-0.5">Публикация в TestFlight или установка через Xcode</h5>
                      <p className="text-slate-400">
                        Подключите iPhone по кабелю и нажмите <code>Run</code> или отправьте сборку в App Store Connect / TestFlight. Приложение запросит разрешение "Добавить конфигурацию VPN" в iOS.
                      </p>
                    </div>
                  </div>
                </div>
              </details>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                <h4 className="font-bold text-sm mb-1 text-white flex items-center gap-2">
                  <span>⚡</span> Преимущества Нативного Приложения перед PWA
                </h4>
                <p>
                  Нативное приложение полностью решает ограничения браузерного PWA.
                </p>
              </div>

              <details className="group rounded-xl bg-slate-950 border border-slate-800 overflow-hidden transition-all">
                <summary className="flex items-center justify-between p-4 cursor-pointer font-bold text-indigo-400 text-sm hover:bg-slate-900/80 transition-colors select-none list-none">
                  <span className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    <span>Детали архитектуры TUN и Раздельного Туннелирования</span>
                  </span>
                  <span className="text-[11px] font-normal text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg flex items-center gap-1.5 group-open:hidden">
                    <span>Раскрыть под катом</span>
                    <ChevronDown className="w-3.5 h-3.5 text-indigo-400" />
                  </span>
                  <span className="text-[11px] font-normal text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg hidden group-open:inline-flex items-center gap-1.5">
                    <span>Скрыть</span>
                    <ChevronDown className="w-3.5 h-3.5 rotate-180 text-indigo-400" />
                  </span>
                </summary>

                <div className="p-4 pt-2 border-t border-slate-900 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <h5 className="font-bold text-sky-400 mb-1 flex items-center gap-1.5">
                      <Shield className="w-4 h-4" />
                      Системный TUN Интерфейс
                    </h5>
                    <p className="text-slate-400 text-xs">
                      Нативный код напрямую создает сетевой адаптер (tun0/utun3) в ядре OS. Весь TCP/UDP/ICMP трафик смартфона автоматически шифруется.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <h5 className="font-bold text-indigo-400 mb-1 flex items-center gap-1.5">
                      <Zap className="w-4 h-4" />
                      Раздельное Туннелирование
                    </h5>
                    <p className="text-slate-400 text-xs">
                      Вы можете направлять через WireGuard только определенные мобильные приложения (например, YouTube, Telegram), а банковские приложения пускать напрямую.
                    </p>
                  </div>
                </div>
              </details>
            </div>
          )}

        </div>

        {/* Подвал */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Готовые исходные файлы доступны в кнопке "Исходный код Native".
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Понятно, закрыть
          </button>
        </div>

      </div>
    </div>
  );
};



