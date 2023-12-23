
class MyApp extends HTMLElement {
    constructor() {
        super()
        this.innerHTML = MyApp.template()
    }

    connectedCallback() {
        fetch('/api/alldata')
            .then(r => r.json())
            .then(d => {
                window.facets = d.facets
                window._data = d
            })

        window.addEventListener('hashchange', this.onRoute)
        this.onRoute()
    }
    
    onRoute() {
        const route = window.location.hash.substring(1).split('/')[0]
        const contentContainer = document.querySelector('my-container')
        contentContainer.innerHTML = ''

        if (route === '') {
            contentContainer.innerHTML = '<my-welcome></my-welcome>'
        } else if (route === 'assessment' || route === '') {
            contentContainer.innerHTML = '<assessment-page></assessment-page>'
        } else if (route === 'about') {
            contentContainer.innerHTML = '<h1>About Page</h1>'
        } else {
            contentContainer.innerHTML = '<h1>404 Not Found</h1>'
        }
    }

    static template() {
        return /* html */`
        <my-modal></my-modal>
        <my-nav></my-nav>
        <my-container></my-container>
        `
    }
}


customElements.define('my-app', MyApp)