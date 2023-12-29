
class MyApp extends HTMLElement {
    constructor() {
        super()
        this.innerHTML = MyApp.template()
    }

    async connectedCallback() {
        const response = await fetch("/api/alldata")
        const data = await response.json()
    
        // TODO: create a data manager class
        window.facets = data.facets
        window._data = data
    
        window.addEventListener("hashchange", this.onRoute.bind(this))
        this.onRoute()
    }

    onRoute() {
        const route = window.location.hash.substring(1).split("/")[0]
        const contentContainer = document.querySelector("my-container")
        contentContainer.innerHTML = ""

        if (route === "") {
            contentContainer.innerHTML = "<my-welcome></my-welcome>"
        } else if (route === "assessment" || route === "") {
            contentContainer.innerHTML = "<assessment-page></assessment-page>"
        } else if (route === "about") {
            contentContainer.innerHTML = "<about-page></about-page>"
        } else if (route === "history") {
            contentContainer.innerHTML = "<history-page></history-page>"
        } else {
            contentContainer.innerHTML = "<article><h1>404 Not Found</h1></article>"
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


customElements.define("my-app", MyApp)