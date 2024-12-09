declare module 'click-outside-vue3' {
  import { DirectiveBinding } from 'vue'

  interface ClickOutsideOptions {
    handler: (event: MouseEvent) => void
    middleware?: (event: MouseEvent) => boolean
    events?: string[]
    isActive?: boolean
    detectIframe?: boolean
    capture?: boolean
  }

  interface ClickOutsideDirective {
    directive: {
      beforeMount: (el: HTMLElement, binding: DirectiveBinding<ClickOutsideOptions>) => void
      updated: (el: HTMLElement, binding: DirectiveBinding<ClickOutsideOptions>) => void
      unmounted: (el: HTMLElement) => void
    }
    install: (app: unknown) => void
  }

  const vClickOutside: ClickOutsideDirective

  export default vClickOutside
}
