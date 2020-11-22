export default function listeners(
  camera, renderer, composer,
  filmPass, stats
) {
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    composer.setSize(window.innerWidth, window.innerHeight)
  }, false)

  window.addEventListener('keydown', e => {
    if (e.keyCode == 192) {
      document.exitPointerLock()
      document.getElementById('menu').classList.toggle('show')
    }
  })

  document.getElementsByName('tvEffect')[0].addEventListener('change', e => {
    filmPass.enabled = e.target.checked
  })

  document.getElementsByName('hideFps')[0].addEventListener('change', e => {
    e.target.checked
      ? stats.fpsEl.classList.add('hide')
      : stats.fpsEl.classList.remove('hide')
  })
}
