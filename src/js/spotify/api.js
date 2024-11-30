// Configuración de Spotify y variables globales
const client_id = "83a3b2f0f4cb46e6ad62b6e83ea2a950";
const client_secret = "270c45b105c54368bc0100219007c092";

// Elementos del DOM - UI Controls
const menuToggle = document.getElementById('menu-toggle');
const themeToggle = document.getElementById('theme-toggle');
const sidebar = document.querySelector('.sidebar');
const contentWrapper = document.querySelector('.content-wrapper');
const themeIcon = themeToggle.querySelector('i');

// Elementos del DOM - Player
const songInput = document.getElementById("song-input");
const searchButton = document.getElementById("search-button");
const albumCover = document.getElementById("album-cover");
const trackTitle = document.getElementById("track-title");
const trackArtist = document.getElementById("track-artist");
const playPauseButton = document.getElementById("playPauseButton");
const playPauseIcon = playPauseButton.querySelector('i');
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");
const shuffleButton = document.getElementById("shuffleButton");
const repeatButton = document.getElementById("repeatButton");
const audio = new Audio();
const progressBar = document.querySelector('.progress-bar');
const progress = document.querySelector('.progress');
const currentTimeElem = document.getElementById("currentTime");
const durationElem = document.getElementById("duration");
const volumeControl = document.getElementById("volumeControl");
const songInfo = document.getElementById("song-info");
const recommendationsContainer = document.getElementById("recommendations");

// Variables de estado
let recommendations = [];
let currentTrackIndex = 0;
let isPlaying = false;
let isDarkTheme = false;
let isShuffleOn = false;
let isRepeatOn = false;

// Funciones de UI
function toggleSidebar() {
    sidebar.classList.toggle('active');
    contentWrapper.classList.toggle('shifted');
}

function toggleTheme() {
    document.body.classList.toggle('tema-oscuro');
    isDarkTheme = !isDarkTheme;
    
    if (isDarkTheme) {
        themeIcon.classList.replace('fa-sun', 'fa-moon');
    } else {
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }

    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
}

// Función para verificar elementos del DOM
function checkElements() {
    const elements = {
        menuToggle, themeToggle, sidebar, contentWrapper, songInput, searchButton,
        albumCover, trackTitle, trackArtist, playPauseButton, prevButton, nextButton,
        shuffleButton, repeatButton, progressBar, currentTimeElem, durationElem, 
        volumeControl, songInfo, recommendationsContainer
    };

    for (const [name, element] of Object.entries(elements)) {
        if (!element) {
            console.error(`Elemento ${name} no encontrado`);
            return false;
        }
    }
    return true;
}

// Funciones de la API de Spotify
async function getAccessToken() {
    try {
        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: "Basic " + btoa(client_id + ":" + client_secret),
            },
            body: "grant_type=client_credentials",
        });
        if (!response.ok) {
            throw new Error('Error en la autenticación');
        }
        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error("Error obteniendo token:", error);
        alert("Error de autenticación con Spotify");
        return null;
    }
}

async function searchSong(song) {
    try {
        const accessToken = await getAccessToken();
        if (!accessToken) return null;
        
        const response = await fetch(
            `https://api.spotify.com/v1/search?q=${encodeURIComponent(song)}&type=track&market=ES`,
            {
                method: "GET",
                headers: {
                    Authorization: "Bearer " + accessToken,
                },
            }
        );
        if (!response.ok) {
            throw new Error('Error en la búsqueda');
        }
        const data = await response.json();
        if (data.tracks && data.tracks.items.length > 0) {
            return data.tracks.items[0];
        }
        return null;
    } catch (error) {
        console.error("Error en searchSong:", error);
        return null;
    }
}

// Funciones del reproductor
function loadTrackInPlayer(trackData) {
    if (!trackData) return;
    
    albumCover.src = trackData.album.images[0].url;
    trackTitle.textContent = trackData.name;
    trackArtist.textContent = trackData.artists.map(artist => artist.name).join(", ");
    audio.src = trackData.preview_url;

    audio.play().catch(error => {
        console.error("Error reproduciendo audio:", error);
    });
    isPlaying = true;
    playPauseIcon.classList.replace('fa-play', 'fa-pause');

    // Guardar en localStorage
    const currentTrack = {
        name: trackData.name,
        artist: trackData.artists[0].name,
        previewUrl: trackData.preview_url,
        albumCover: trackData.album.images[0].url
    };
    localStorage.setItem("currentTrack", JSON.stringify(currentTrack));

    audio.addEventListener("loadedmetadata", () => {
        const durationMinutes = Math.floor(audio.duration / 60);
        const durationSeconds = Math.floor(audio.duration % 60);
        durationElem.textContent = `${durationMinutes}:${durationSeconds < 10 ? '0' : ''}${durationSeconds}`;
    });
}

async function displayRecommendations(songURI) {
    try {
        const accessToken = await getAccessToken();
        if (!accessToken || !songURI) return;

        const trackID = songURI.split(":")[2];
        const response = await fetch(
            `https://api.spotify.com/v1/recommendations?seed_tracks=${trackID}&limit=20&market=ES`,
            {
                method: "GET",
                headers: {
                    Authorization: "Bearer " + accessToken,
                },
            }
        );
        
        if (!response.ok) {
            throw new Error('Error obteniendo recomendaciones');
        }

        const data = await response.json();
        
        recommendationsContainer.innerHTML = "<h2>Recomendaciones:</h2>";
        recommendations = data.tracks;
        currentTrackIndex = 0;
        
        data.tracks.forEach((track, index) => {
            const trackContainer = document.createElement("div");
            trackContainer.className = "recommendation-item";
            
            const trackInfo = document.createElement("p");
            trackInfo.textContent = `${track.name} - ${track.artists.map(artist => artist.name).join(", ")}`;
            
            trackContainer.appendChild(trackInfo);
            recommendationsContainer.appendChild(trackContainer);

            trackContainer.addEventListener("click", () => {
                currentTrackIndex = index;
                loadTrackInPlayer(track);
            });
        });
        
        recommendationsContainer.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
        console.error("Error en displayRecommendations:", error);
        recommendationsContainer.innerHTML = "<p>Error al cargar recomendaciones</p>";
    }
}

// Funciones de control de reproducción
function playNextTrack() {
    if (recommendations.length === 0) return;
    if (isShuffleOn) {
        currentTrackIndex = Math.floor(Math.random() * recommendations.length);
    } else {
        currentTrackIndex = (currentTrackIndex + 1) % recommendations.length;
    }
    loadTrackInPlayer(recommendations[currentTrackIndex]);
}

function playPrevTrack() {
    if (recommendations.length === 0) return;
    if (isShuffleOn) {
        currentTrackIndex = Math.floor(Math.random() * recommendations.length);
    } else {
        currentTrackIndex = (currentTrackIndex - 1 + recommendations.length) % recommendations.length;
    }
    loadTrackInPlayer(recommendations[currentTrackIndex]);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    if (!checkElements()) {
        console.error("Faltan elementos del DOM necesarios");
        return;
    }
    
    // Cargar tema guardado
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('tema-oscuro');
        themeIcon.classList.replace('fa-sun', 'fa-moon');
        isDarkTheme = true;
    }

    // Cargar último track reproducido
    const savedTrack = localStorage.getItem("currentTrack");
    if (savedTrack) {
        const trackData = JSON.parse(savedTrack);
        albumCover.src = trackData.albumCover;
        trackTitle.textContent = trackData.name;
        trackArtist.textContent = trackData.artist;
        audio.src = trackData.previewUrl;
    }

    // Inicializar volumen
    audio.volume = volumeControl.value;
});

// UI Event Listeners
menuToggle.addEventListener('click', toggleSidebar);

document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && 
        !menuToggle.contains(e.target) && 
        sidebar.classList.contains('active')) {
        toggleSidebar();
    }
});

themeToggle.addEventListener('click', toggleTheme);

// Player Event Listeners
playPauseButton.addEventListener('click', () => {
    if (audio.paused) {
        audio.play().catch(e => console.error("Error al reproducir:", e));
        playPauseIcon.classList.replace('fa-play', 'fa-pause');
        isPlaying = true;
    } else {
        audio.pause();
        playPauseIcon.classList.replace('fa-pause', 'fa-play');
        isPlaying = false;
    }
});

shuffleButton.addEventListener('click', () => {
    isShuffleOn = !isShuffleOn;
    shuffleButton.classList.toggle('active');
});

repeatButton.addEventListener('click', () => {
    isRepeatOn = !isRepeatOn;
    repeatButton.classList.toggle('active');
});

volumeControl.addEventListener('input', (e) => {
    audio.volume = e.target.value;
    localStorage.setItem('volume', e.target.value);
});

progressBar.addEventListener('click', (e) => {
    const progressWidth = progressBar.clientWidth;
    const clickX = e.offsetX;
    const progressPercentage = (clickX / progressWidth);
    
    audio.currentTime = progressPercentage * audio.duration;
});

audio.addEventListener("timeupdate", () => {
    const currentMinutes = Math.floor(audio.currentTime / 60);
    const currentSeconds = Math.floor(audio.currentTime % 60);
    currentTimeElem.textContent = `${currentMinutes}:${currentSeconds < 10 ? '0' : ''}${currentSeconds}`;
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progress.style.width = `${progressPercent}%`;
});

audio.addEventListener("ended", () => {
    if (isRepeatOn) {
        audio.currentTime = 0;
        audio.play();
    } else {
        playNextTrack();
    }
});

// Búsqueda y reproducción
searchButton.addEventListener("click", async () => {
    const songName = songInput.value;
    if (!songName) {
        alert("Por favor ingresa el nombre de una canción");
        return;
    }
    
    const trackData = await searchSong(songName);
    if (trackData) {
        loadTrackInPlayer(trackData);
        await displayRecommendations(trackData.uri);
    } else {
        songInfo.innerHTML = "Canción no encontrada.";
    }
});

// Controles de reproducción
nextButton.addEventListener("click", playNextTrack);
prevButton.addEventListener("click", playPrevTrack);