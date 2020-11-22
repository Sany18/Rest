const template = `
  <div class="player-wrapper">
    <audio id="player" controls></audio>
  </div>

  <div id="menu">
    <div class="item">
      <input type="checkbox" name="hideFps">
      <label for="hideFps">Hide fps</label>
    </div>
    
    <div class="item">
      <input type="checkbox" name="tvEffect">
      <label for="tvEffect">TV effect</label>
    </div>
  </div>
`

document.write(template)
