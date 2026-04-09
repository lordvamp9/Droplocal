# XP Drop

XP Drop es una aplicación web local inspirada en el legendario estilo visual de **Windows XP / Pocket PC**, diseñada para transferir archivos de forma rápida y segura entre computadoras y dispositivos móviles usando tecnología WebRTC.

## 🚀 Demo
[Inserta aquí tu enlace de demostración URL]

## ✨ Características Principales
- **Estética Retro:** Diseño cuidadosamente trabajado para emular las entrañables interfaces de Windows XP y las antiguas PDAs (Pocket PC).
- **100% P2P (Peer-to-Peer):** Los archivos viajan directamente entre tu computadora y tu celular. No hay servidores intermediarios guardando tus datos. Total privacidad.
- **Conectividad por Código QR:** Las sesiones se inician fácilmente escaneando un código QR dinámico desde la pantalla de la computadora.
- **Archivos Sin Límite:** Transmisión basada en `ArrayBuffer` puro, permitiéndote enviar archivos del tamaño que quieras (limitado únicamente por la memoria RAM de tus dispositivos) sin corromperse y a la máxima velocidad posible.
- **Despliegue Simple:** Construido enteramente con HTML, CSS y Javascript vanilla. Sin frameworks pesados ni compilaciones.

## 🛠 Instalación y Uso

Dado que el proyecto es 100% *Frontend*, puedes correrlo de forma extremadamente sencilla:

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
3. Alternativamente, simplemente subirlo a plataformas como Netlify, Vercel o GitHub Pages es suficiente, ya que cuenta con un archivo `netlify.toml` listo.

## 🔒 Privacidad y Seguridad
- **Cero Retención de Datos:** Al utilizar la librería PeerJS (`peerjs.com`) para establecer la ruta, el servidor de señalización únicamente cruza direcciones IP de forma momentánea. En ningún momento tus archivos pesados tocan un servidor externo. Todo viaja bajo el cifrado integrado de los canales WebRTC (DTLS/SCTP).
- **Sesiones Únicas:** Cada vez que la web se carga en la computadora, se genera un ID de sesión efímero codificado en el QR. Al actualizar la página la conexión desaparece y el ID anterior queda invalidado.

## 👨‍💻 Tecnologías Empleadas
- HTML5, CSS3, JavaScript Vanilla
- [PeerJS](https://peerjs.com/) para el WebRTC.
- [qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator) para los QRs dinámicos.
