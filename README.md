# XP Drop

![Astro](https://img.shields.io/badge/Astro-FF7E33?style=for-the-badge&logo=astro&logoColor=white)
![WebRTC](https://img.shields.io/badge/WebRTC-333333?style=for-the-badge&logo=webrtc&logoColor=white)
![P2P](https://img.shields.io/badge/P2P-Peer_to_Peer-blue?style=for-the-badge)
![File Transfer](https://img.shields.io/badge/File_Transfer-Any_Size-green?style=for-the-badge)

XP Drop es una aplicación web local inspirada en el legendario estilo visual de Windows XP / Pocket PC, diseñada para transferir archivos de forma rápida y segura entre computadoras y dispositivos móviles usando tecnología WebRTC.

## Demo
[](https://droplocal.netlify.app/)
## Características Principales
- Estética Retro: Diseño cuidadosamente trabajado para emular las entrañables interfaces de Windows XP y las antiguas PDAs (Pocket PC).
- 100% P2P (Peer-to-Peer): Los archivos viajan directamente entre tu computadora y tu celular. No hay servidores intermediarios guardando tus datos. Total privacidad.
- Conectividad por Código QR o Código Manual: Las sesiones se inician fácilmente escaneando un código QR dinámico desde la pantalla de la computadora o introduciendo el código de sesión.
- Archivos Sin Límite: Transmisión basada en `ArrayBuffer` puro optimizado en "chunks", permitiéndote enviar archivos del tamaño que quieras sin corromperse y a la máxima velocidad posible.
- Moderno y Eficiente: Migrado y optimizado usando Astro para asegurar cargas instantáneas y un flujo de desarrollo moderno.

## Instalación y Uso

Dado que el proyecto utiliza Astro, puedes correrlo de forma extremadamente sencilla:

1. Clona el repositorio:
   ```bash
   git clone https://github.com/vamp9/Droplocal.git
   ```
2. Instala las dependencias y ejecuta el servidor local:
   ```bash
   npm install
   npm run dev
   ```
3. Alternativamente, puedes compilarlo a archivos estáticos usando `npm run build` y subirlo a Netlify, Vercel o GitHub Pages.

## Privacidad y Seguridad
- Cero Retención de Datos: Al utilizar la librería PeerJS (`peerjs.com`) para establecer la ruta, el servidor de señalización únicamente cruza direcciones IP de forma momentánea. En ningún momento tus archivos pesados tocan un servidor externo. Todo viaja bajo el cifrado integrado de los canales WebRTC (DTLS/SCTP).
- Sesiones Únicas: Cada vez que la web se carga en la computadora, se genera un ID de sesión efímero codificado en el QR. Al actualizar la página la conexión desaparece y el ID anterior queda invalidado.

## Tecnologías Empleadas
- Astro
- HTML5, CSS3, JavaScript Vanilla
- PeerJS para el WebRTC.
- qrcode-generator para los QRs dinámicos.
