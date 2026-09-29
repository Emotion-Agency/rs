import './libs/ie-detect'
import './libs/sayHello'

import Highway from '@dogstudio/highway'
import {Home, About, Case, Contacts, Cases, ErrorPage} from '@core/renderers'
import {Basic, FromNav, Distort} from '@core/transitions'
import Hooks from '@core/Hooks'

import moveEl from './libs/moveEl'
import cssWebP from './libs/testWebP'

import Button from './components/Button'
import Theme from './components/theme'
import Nav from './components/Nav'
import FormPopUp from './components/FormPopUp'
import Loader from './components/Loader'
import {Cursor} from './components/Cursor'

import NavbarPos from './utils/navbarPos'
import themeBtn from './utils/themeBtn'
import {resize} from './utils/Resize'
import {winSizes} from './utils/winSizes'
import {intersectionOvserver} from './utils/intersectionOvserver'
import bgWebP from './utils/bgWebP'

import FormSubmit from './form/FormSubmit'
import {setState, state} from './state'
import * as serviceWorker from './serviceWorker'

process.env.NODE_ENV === 'production' && cssWebP()

const H = new Highway.Core({
  renderers: {
    home: Home,
    about: About,
    case: Case,
    contacts: Contacts,
    cases: Cases,
    errorPage: ErrorPage,
  },
  transitions: {
    default: Basic,
    contextual: {
      nav: FromNav,
      distort: Distort,
    },
  },
})

const hooks = new Hooks(H)

hooks.useNavigateOut(() => {
  setState(state, (state.isLoaded = false))
  document.body.style.pointerEvents = 'none'
  document.documentElement.style.cursor = 'wait'
})

hooks.useNavigateEnd(() => {
  setState(state, (state.isLoaded = true))
  document.body.style.pointerEvents = 'auto'
  document.documentElement.style.cursor = 'auto'
})

let smoothScroll

hooks.useBothStart(() => {
  bgWebP()
  moveEl()
  const sections = [
    ...document.querySelectorAll('header'),
    ...document.querySelectorAll('.section'),
    ...document.querySelectorAll('footer'),
  ]
  sections.forEach(section => {
    intersectionOvserver(section).on()
  })

  const btns = document.querySelectorAll('.js-sticky')

  btns.forEach(btn => {
    new Button(btn)
  })
  smoothScroll && smoothScroll.reset()
})

hooks.useLoad(() => {
  new Loader(() => {
    import(
      /* webpackChunkName: "smooth-scroll" */
      './components/SmoothScroll/SmoothScroll'
    ).then(module => {
      const SmoothScroll = module.default
      smoothScroll = new SmoothScroll('#scroll-container')
    })

    new Cursor()

    const navbarPos = new NavbarPos()
    navbarPos.init()
    themeBtn()

    new Nav()

    const formpoup = new FormPopUp()
    formpoup.init()
    new FormSubmit(document.querySelector('.form'))
  })

  resize.on(winSizes)
  new Theme()
})

const links = document.querySelectorAll('nav a')

hooks.useBoth(() => {
  links.forEach(link => {
    link.parentNode.classList.remove('is-active')
    link.href === location.href && link.parentNode.classList.add('is-active')
  })
})

serviceWorker.unregister()
