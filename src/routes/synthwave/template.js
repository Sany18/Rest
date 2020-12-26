const template = `
  <div class="player-wrapper">
    <audio id="player" controls></audio>
  </div>

  <div id="menu">
    <div class="item">
      <input type="checkbox" id="hideFps">
      <label for="hideFps">Hide fps</label>
    </div>
    
    <div class="item">
      <input type="checkbox" id="tvEffect">
      <label for="tvEffect">TV effect</label>
    </div>

    <div class="item">
      <input type="checkbox" id="anaglyphEffect">
      <label for="anaglyphEffect">Anaglypg effect</label>
    </div>
  </div>
`

document.write(template)
