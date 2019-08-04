// a key map of allowed keys
var allowedKeys = {
  75: 'k',
  85: 'u',
  73: 'i',
  72: 'h',
};

// the 'official' Konami Code sequence
var konamiCode = ['k', 'u', 'i', 'h'];

// a variable to remember the 'position' the user has reached so far.
var konamiCodePosition = 0;

// add keydown event listener
document.addEventListener('keydown', function(e) {
  // get the value of the key code from the key map
  var key = allowedKeys[e.keyCode];
  // get the value of the required key from the konami code
  var requiredKey = konamiCode[konamiCodePosition];

  // compare the key with the required key
  if (key == requiredKey) {

    // move to the next key in the konami code sequence
    konamiCodePosition++;

    // if the last key is reached, activate cheats
    if (konamiCodePosition == konamiCode.length) {
      activateCheats();
      konamiCodePosition = 0;
    }
  } else {
    konamiCodePosition = 0;
  }
});

function activateCheats() {

  var audio = new Audio('/assets/u_cant_hold_us_bro.mp3');
  audio.play();

  alert("No, you can't hold us.");
}