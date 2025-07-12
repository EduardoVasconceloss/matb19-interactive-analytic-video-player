// script.js

document.addEventListener('DOMContentLoaded', function () {
    const videoElement = document.querySelector('#meuVideo');
    const playBtn = document.querySelector('#playBtn');

    // 1. Inicializar o Wavesurfer
    const wavesurfer = WaveSurfer.create({
        container: '#waveform',
        waveColor: 'violet',
        progressColor: 'purple',
        backend: 'MediaElement' // Essencial para sincronizar com o elemento <video>
    });

    // 2. Carregar o vídeo no Wavesurfer
    wavesurfer.load(videoElement);

    // 3. Sincronizar Play/Pause
    playBtn.addEventListener('click', () => {
        wavesurfer.playPause();
    });

    // Sincroniza o botão com o estado do player
    wavesurfer.on('play', () => playBtn.textContent = 'Pause');
    wavesurfer.on('pause', () => playBtn.textContent = 'Play');

    const transcricaoContainer = document.querySelector('#transcricao');

    // 4. Renderizar a transcrição na tela
    dadosVideo.transcricao.forEach(item => {
        const p = document.createElement('p');
        p.textContent = item.text;
        p.setAttribute('data-start', item.start);
        p.setAttribute('data-end', item.end);
        p.id = `line-${item.start}`; // ID único para cada linha
        transcricaoContainer.appendChild(p);
    });

    // 5. Sincronizar a transcrição com o tempo do vídeo
    let linhaAtual = null;
    wavesurfer.on('audioprocess', (currentTime) => {
        for (const item of dadosVideo.transcricao) {
            if (currentTime >= item.start && currentTime <= item.end) {
                if (linhaAtual !== `line-${item.start}`) {
                    // Remove o destaque da linha antiga (se houver)
                    if (linhaAtual) {
                        document.getElementById(linhaAtual).classList.remove('highlight');
                    }
                    // Adiciona o destaque na nova linha
                    const novaLinha = document.getElementById(`line-${item.start}`);
                    novaLinha.classList.add('highlight');
                    linhaAtual = `line-${item.start}`;
                }
                return; // Sai do loop assim que encontrar a linha certa
            }
        }
    });

    // 6. Tornar a transcrição clicável
    transcricaoContainer.addEventListener('click', (e) => {
        if (e.target.tagName === 'P') {
            const startTime = parseFloat(e.target.getAttribute('data-start'));
            wavesurfer.seekTo(startTime / wavesurfer.getDuration());
        }
    });

    const marcadoresContainer = document.querySelector('#marcadores-aqui');

    // 7. Renderizar os marcadores na timeline
    // Precisamos da duração total para calcular as posições, então esperamos o vídeo carregar
    wavesurfer.on('ready', () => {
        const duracaoTotal = wavesurfer.getDuration();
        dadosVideo.marcadores.forEach(marcador => {
            const marcadorEl = document.createElement('div');
            marcadorEl.className = 'marcador';
            marcadorEl.style.left = `${(marcador.time / duracaoTotal) * 100}%`;
            marcadorEl.title = marcador.label; // Tooltip com o texto

            marcadorEl.addEventListener('click', () => {
                wavesurfer.seekTo(marcador.time / duracaoTotal);
            });

            marcadoresContainer.appendChild(marcadorEl);
        });
    });

});
