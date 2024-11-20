const Routes = {
    // Configuración de rutas
    paths: {
        home: '/index.html',
        player: '/player.html'
    },

    // Navegar al reproductor
    goToPlayer() {
        const currentUrl = window.location.origin;
        window.location.href = `${currentUrl}/player.html`;
    },

    // Navegar a home
    goToHome() {
        const currentUrl = window.location.origin;
        window.location.href = `${currentUrl}/index.html`;
    }
};

export default Routes;