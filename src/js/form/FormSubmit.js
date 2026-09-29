import FormInputs from './FormInputs.js'
import {animation} from './animation.js'

export default class FormSubmit extends FormInputs {
  constructor(form) {
    super(form)

    this.form.onsubmit = e => this.submit(e)
  }

  validation() {
    this.form.classList.add('error')
    this.email.focus()
  }

  requestLoad() {
    this.form.reset()
    // window.dataLayer.push({event: 'form_sent'})
    document.body.classList.remove('form-focused')
    for (const input of this.input) {
      input.parentNode.classList.remove('focus')
    }
    animation(this.form)
  }

  // Sends the form to Formspree (endpoint is the form's action attribute)
  async requestSend() {
    try {
      const res = await fetch(this.form.action, {
        method: 'POST',
        body: new FormData(this.form),
        headers: {
          Accept: 'application/json',
        },
      })

      if (res.ok) {
        this.requestLoad()
        return
      }
      console.log(await res.text())
    } catch (e) {
      console.log(e)
    }
    alert(this.form.getAttribute('data-error'))
  }

  submit(e) {
    e.preventDefault()
    if (!this.regExp.test(this.email.value)) {
      this.validation()
    } else {
      this.requestSend()
    }
    return false
  }
}
