Aplicación Web de Música con Visualizador 3D 🎵🌌
Descripción
Esta es una aplicación web que reproduce música utilizando la API de Spotify e integra un visualizador 3D interactivo hecho con Three.js. La experiencia incluye animaciones dinámicas sincronizadas con la música en un entorno gráfico tridimensional. La aplicación está desarrollada con Parcel como empaquetador, lo que garantiza un flujo de trabajo rápido y sencillo.

Características principales 🚀
Reproducción de música: Conexión directa a la API de Spotify para acceder a canciones y listas de reproducción.
Visualizador 3D: Representación gráfica de la música mediante animaciones interactivas creadas con Three.js.
Interactividad: Elementos 3D clicables que interactúan con la música.
Rendimiento optimizado: Parcel como herramienta de construcción para cargar rápidamente los recursos.
Requisitos del sistema 🖥️
Node.js: Versión 16 o superior.
Parcel: Instalado globalmente o como dependencia local.
Spotify API: Necesitas una cuenta de desarrollador y las credenciales de la API de Spotify.
Instalación 🛠️
Clona el repositorio:

bash
Copiar código
git clone https://github.com/usuario/aplicacion-musica-visualizador.git
cd aplicacion-musica-visualizador
Instala las dependencias:

bash
Copiar código
npm install
Configura las credenciales de Spotify:

Crea un archivo .env en la raíz del proyecto.
Agrega tus credenciales de la API de Spotify:
env
Copiar código
SPOTIFY_CLIENT_ID=tu_client_id
SPOTIFY_CLIENT_SECRET=tu_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:1234/callback
Ejecuta el servidor de desarrollo:

bash
Copiar código
npm start
Abre la aplicación en tu navegador:
http://localhost:1234

Uso 🎧
Inicia sesión con tu cuenta de Spotify.
Selecciona una canción o lista de reproducción desde la interfaz.
Disfruta del visualizador 3D mientras escuchas música.
Tecnologías utilizadas 🛠️
Frontend:
Three.js para el visualizador 3D.
Parcel como empaquetador.
Backend:
Spotify Web API para obtener música.
Otros:
JavaScript, HTML, CSS.