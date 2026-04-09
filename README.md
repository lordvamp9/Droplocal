# XP Drop

XP Drop es una aplicación web local diseñada para transferir archivos de forma rápida y segura entre computadoras y dispositivos móviles usando tecnología WebRTC.

## Demo
https://droplocal.netlify.app/

## Características Principales
- **Estética Retro**.
- **100% P2P (Peer-to-Peer)**
- **Conectividad por Código QR**
- **Archivos Sin Límite**
- **Despliegue Simple**

## Instalación y Uso
1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/xp-drop.git
   ```
2. Ejecuta un servidor local en la carpeta raíz (por ejemplo de Python o Node.js):
   ```bash
   # Si usas Python
   python -m http.server 3000
   
   # O si usas Node.js (npx)
   npx serve .
   ```
   
##  Privacidad y Seguridad
- **Cero Retención de Datos** 
- **Sesiones Únicas:** Cada vez que la web se carga en la computadora, se genera un ID de sesión efímero codificado en el QR. Al actualizar la página la conexión desaparece y el ID anterior queda invalidado.

##  Tecnologías Empleadas
- HTML5, CSS3, JavaScript
- PeerJS(https://peerjs.com/) para el WebRTC.
- qrcode-generator(https://github.com/kazuhikoarase/qrcode-generator) para los QRs dinámicos.
