const musicContainer = document.getElementById('music-container');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const audio = document.getElementById('audio');
const progress = document.getElementById('progress');
const title = document.getElementById('title');
const cover = document.getElementById('cover');
const barChartWrapper = document.getElementById('bar-chart-wrapper');

const songs = ['One Call Away', 'China-X', '君色に染まる'];

let songIndex = 1;

function loadSong(song) {
  title.innerText = song;
  audio.src = `assets/${song}.mp3`;
  cover.src = `assets/${song}.jpg`;
}

loadSong(songs[songIndex]);

function playSong() {
  musicContainer.classList.add('play');
  barChartWrapper.classList.add('active');
  playBtn.querySelector('i.fas').classList.remove('fa-play');
  playBtn.querySelector('i.fas').classList.add('fa-pause');
  audio.play();
  onLoadAudio();
}

function pauseSong() {
  musicContainer.classList.remove('play');
  barChartWrapper.classList.remove('active');
  playBtn.querySelector('i.fas').classList.add('fa-play');
  playBtn.querySelector('i.fas').classList.remove('fa-pause');
  audio.pause();
}

function prevSong() {
  songIndex -= 1;
  if (songIndex < 0) {
    songIndex = songs.length - 1;
  }
  loadSong(songs[songIndex]);
  playSong();
}

function nextSong() {
  songIndex += 1;
  if (songIndex > songs.length - 1) {
    songIndex = 0;
  }
  loadSong(songs[songIndex]);
  playSong();
}

function updateProgress(e) {
  const {duration, currentTime} = e.target;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;
}

function onLoadAudio() {
  let context = new window.AudioContext();
  let analyser = context.createAnalyser();
  analyser.fftSize = 512;
  let source = context.createMediaElementSource(audio);
  source.connect(analyser);
  analyser.connect(context.destination);

  let bufferLength = analyser.frequencyBinCount;
  let dataArray = new Uint8Array(bufferLength);

  let canvas = document.getElementById('canvas');
  canvas.width = 640;
  canvas.height = 255;

  let ctx = canvas.getContext('2d');
  const WIDTH = canvas.width;
  const HEIGHT = canvas.height;

  let barWidth = WIDTH / bufferLength * 1.5;
  let barHeight;

  function renderFrame() {
    requestAnimationFrame(renderFrame);
    analyser.getByteFrequencyData(dataArray);
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    for (let i = 0, x = 0; i < bufferLength; i++) {
      barHeight = dataArray[i];

      let r = barHeight + 25 * (i / bufferLength);
      let g = 250 * (i / bufferLength);
      let b = 50;

      ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
      ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

      x += barWidth + 2;
    }
  }

  renderFrame();
}

playBtn.addEventListener('click', () => {
  const isPlaying = musicContainer.classList.contains('play');
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});

prevBtn.addEventListener('click', prevSong);

nextBtn.addEventListener('click', nextSong);

audio.addEventListener('timeupdate', updateProgress);

audio.addEventListener('ended', nextSong);