/**
 * Now-playing widget: click the card to play/pause the configured audio.
 * Only activates when .now-playing has the `.playable` class (i.e. audio_url set).
 */
(function () {
  'use strict';
  var card = document.querySelector('.now-playing.playable');
  if (!card) return;
  var audio = card.querySelector('.np-audio');
  if (!audio) return;

  function toggle() {
    if (audio.paused) {
      audio.play().catch(function (err) { console.warn('Audio play blocked:', err); });
    } else {
      audio.pause();
    }
  }

  card.addEventListener('click', toggle);
  card.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
  });
  audio.addEventListener('play',  function () { card.classList.add('playing'); });
  audio.addEventListener('pause', function () { card.classList.remove('playing'); });
  audio.addEventListener('ended', function () { card.classList.remove('playing'); });
})();
