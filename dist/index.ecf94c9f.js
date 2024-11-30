// Elementos del DOM
const menuToggle = document.getElementById('menu-toggle');
const themeToggle = document.getElementById('theme-toggle');
const sidebar = document.querySelector('.sidebar');
const contentWrapper = document.querySelector('.content-wrapper');
const themeIcon = themeToggle.querySelector('i');
// Toggle del menú lateral
menuToggle.addEventListener('click', ()=>{
    sidebar.classList.toggle('active');
    contentWrapper.classList.toggle('shifted');
});
// Cerrar sidebar al hacer clic fuera
document.addEventListener('click', (e)=>{
    if (!sidebar.contains(e.target) && !menuToggle.contains(e.target) && sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
        contentWrapper.classList.remove('shifted');
    }
});
// Cambio de tema
let isDarkTheme = false;
themeToggle.addEventListener('click', ()=>{
    document.body.classList.toggle('tema-oscuro');
    isDarkTheme = !isDarkTheme;
    // Cambiar el ícono
    if (isDarkTheme) {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    } else {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
    // Guardar preferencia en localStorage
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
});
// Cargar tema guardado
document.addEventListener('DOMContentLoaded', ()=>{
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('tema-oscuro');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        isDarkTheme = true;
    }
});
// Reproductor de música
const playPauseButton = document.getElementById('playPauseButton');
const playPauseIcon = playPauseButton.querySelector('i');
let isPlaying = false;
playPauseButton.addEventListener('click', ()=>{
    isPlaying = !isPlaying;
    if (isPlaying) {
        playPauseIcon.classList.remove('fa-play');
        playPauseIcon.classList.add('fa-pause');
    // Aquí iría la lógica para reproducir la música
    } else {
        playPauseIcon.classList.remove('fa-pause');
        playPauseIcon.classList.add('fa-play');
    // Aquí iría la lógica para pausar la música
    }
});
// Control de volumen
const volumeControl = document.getElementById('volumeControl');
volumeControl.addEventListener('input', (e)=>{
    const volume = e.target.value;
    // Aquí iría la lógica para ajustar el volumen
    console.log('Volumen:', volume);
});
// Barra de progreso
const progressBar = document.querySelector('.progress-bar');
const progress = document.querySelector('.progress');
progressBar.addEventListener('click', (e)=>{
    const progressWidth = progressBar.clientWidth;
    const clickX = e.offsetX;
    const progressPercentage = clickX / progressWidth * 100;
    progress.style.width = progressPercentage + '%';
// Aquí iría la lógica para cambiar el tiempo de la canción
});

//# sourceMappingURL=index.ecf94c9f.js.map
