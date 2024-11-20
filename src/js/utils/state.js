// Gestión del estado de la aplicación
const State = {
    // Estado inicial
    _state: {
        currentTrack: null,
        isPlaying: false,
        visualizerActive: false
    },

    // Guardar datos de la canción
    setTrackData(trackData) {
        // Guardar en sessionStorage para persistir entre páginas
        sessionStorage.setItem('trackData', JSON.stringify(trackData));
        this._state.currentTrack = trackData;
    },

    // Obtener datos de la canción
    getTrackData() {
        if (!this._state.currentTrack) {
            // Intentar recuperar de sessionStorage
            const savedData = sessionStorage.getItem('trackData');
            if (savedData) {
                this._state.currentTrack = JSON.parse(savedData);
            }
        }
        return this._state.currentTrack;
    },

    // Limpiar los datos
    clearTrackData() {
        sessionStorage.removeItem('trackData');
        this._state.currentTrack = null;
    },

    // Actualizar estado de reproducción
    setPlayingState(isPlaying) {
        this._state.isPlaying = isPlaying;
    },

    // Obtener estado de reproducción
    isPlaying() {
        return this._state.isPlaying;
    },

    // Activar/desactivar visualizador
    setVisualizerState(active) {
        this._state.visualizerActive = active;
    },

    // Verificar si el visualizador está activo
    isVisualizerActive() {
        return this._state.visualizerActive;
    }
};

export default State;