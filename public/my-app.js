
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

        window.addEventListener('load',()=>{
            function initHashChangeListener() {
                function onHashChange() {
                    const hash = window.location.hash
                    const path = hash.substring(1)
                    const route = parseRoute(path)
                    handleRouteChange(route)
                }
                function parseRoute(path) {
                    return path.split('/')
                }
                function handleRouteChange(route) {
                    const contentContainer = document.querySelector('my-container')
                    contentContainer.innerHTML = ''

                    if (route[0] === '') {
                        contentContainer.innerHTML = '<my-welcome></my-welcome>'
                    } else if (route[0] === 'assessment' || route[0] === '') {
                        contentContainer.innerHTML = '<assessment-page></assessment-page>'
                    } else if (route[0] === 'about') {
                        contentContainer.innerHTML = '<h1>About Page</h1>'
                    } else {
                        contentContainer.innerHTML = '<h1>404 Not Found</h1>'
                    }
                }
                window.addEventListener('hashchange', onHashChange)
                onHashChange()
            }

            initHashChangeListener()
        })
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