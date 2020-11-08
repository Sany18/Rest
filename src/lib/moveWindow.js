const tagName = 'can-move'

window.addEventListener('load', () => {
  let isMouseDown = false
  let isCtrlDown = false
  let currentElement, offset
  const elements = document.getElementsByClassName(tagName)

  const onMouseMove = event => {
    if (isMouseDown && isCtrlDown) {
      currentElement.style.left = (event.clientX + offset[0]) + 'px'
      currentElement.style.top  = (event.clientY + offset[1]) + 'px'
    }
  }

  const mouseDown = event => {
    isMouseDown = true
    currentElement = event.target
    offset = [
      currentElement.offsetLeft - event.clientX,
      currentElement.offsetTop - event.clientY
    ]
  }

  const stopMove = event => {
    isMouseDown = false

    if (currentElement) {
      localStorage.setItem(currentElement.name, JSON.stringify(
        [currentElement.style.left, currentElement.style.top]
      ))
    }
  }

  for (let i = 0; i < elements.length; i++) {
    const elemName = `${tagName}-${i}`
    const storageElem = localStorage.getItem(elemName)
    
    elements[i].addEventListener('mousedown', mouseDown)
    elements[i].name = elemName

    if (storageElem) {
      elements[i].style.left = JSON.parse(storageElem)[0]
      elements[i].style.top = JSON.parse(storageElem)[1]
    } else {
      elements[i].style.left = '0px'
      elements[i].style.top = `${i*30}px`
    }
  }

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', stopMove)
  document.addEventListener('keydown', event => {
    if (event.keyCode == 17) isCtrlDown = true
  })
  document.addEventListener('keyup', event => {
    isCtrlDown = false
  })
})
