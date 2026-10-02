// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// =============================================
// MEDIA CONTROLLER — only ONE media plays at a time
// =============================================

const ytPlayers = [];
const nativeMedia = [];

function pauseAllNative(except) {
  nativeMedia.forEach(audio => {
    if (audio !== except && !audio.paused) audio.pause();
  });
}

function pauseAllYoutube(except) {
  ytPlayers.forEach(p => {
    if (p !== except) {
      try { p.pauseVideo(); } catch (e) {}
    }
  });
}

document.querySelectorAll('audio').forEach(audio => {
  nativeMedia.push(audio);
  audio.addEventListener('play', () => {
    pauseAllNative(audio);
    pauseAllYoutube(null);
  });
});

// ---- Load YouTube IFrame API ----
const ytScript = document.createElement('script');
ytScript.src = "https://www.youtube.com/iframe_api";
document.head.appendChild(ytScript);

function onYouTubeIframeAPIReady() {
  document.querySelectorAll('.yt-player').forEach(el => {
    const videoId = el.dataset.videoId;

    const player = new YT.Player(el, {
      videoId: videoId,
      playerVars: {
        'playsinline': 1,
        'rel': 0,
        'modestbranding': 1
      },
      events: {
        'onStateChange': (event) => {
          if (event.data === YT.PlayerState.PLAYING) {
            pauseAllYoutube(event.target);
            pauseAllNative(null);
          }
        }
      }
    });

    ytPlayers.push(player);
  });
}

window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;

// ---- Fade-in on scroll ----
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.song-card, .video-card, .section-title').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'all 0.6s ease';
  observer.observe(el);
});

console.log('🎬 Media Blog loaded — single-media controller active!');