export const copy = (value, successfully = () => null, failure = () => null) => {
  const clipboard = navigator.clipboard
  if (clipboard !== undefined) {
    navigator.clipboard.writeText(value).then(successfully, failure)
  } else {
    if (document.execCommand) {
      let el: HTMLInputElement = document.createElement('input')
      el.value = value
      document.body.append(el)

      el.select()
      el.setSelectionRange(0, value.length)

      if (document.execCommand('copy')) {
        successfully()
      }

      el.remove()
      el = null
    } else {
      failure()
    }
  }
}
