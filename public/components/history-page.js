class HistoryPage extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.innerHTML = HistoryPage.template()
    }

    static template() {
        return /* html */`
        <article>
            <h2>Nothing to see here</h2>
        </article>`
    }

}

customElements.define('history-page', HistoryPage)