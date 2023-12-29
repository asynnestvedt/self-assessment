/**
 * this file contains some component base classes.
 */
export default class SimplePubSubHub {
    constructor() {
        this.listeners = {}
    }

    subscribe(topics = [], context) {
        topics.forEach(function (t) {
            if (!this.listeners[t]) {
                this.listeners[t] = new Set()
            }
            this.listeners[t].add(context)
        }.bind(this))
    }

    unsubscribe(topics, context) {
        topics.forEach(function (t) {
            if (!this.listeners[t]) {
                return
            }
            this.listeners[t].remove(context)
        }.bind(this))
    }

    publish(topic, payload) {
        if (!this.listeners[topic]) { return }
        else if (this.listeners[topic].size === 0) { delete this.listeners[topic] }

        Array.from(this.listeners[topic]).forEach(context => {
            if (typeof context.onMessage === "function") {
                // TODO: create deep copies of payload
                let dupe
                if (Array.isArray(payload)) {
                    dupe = [].concat(...payload)
                } else if (["string", "boolean", "number"].includes(typeof payload)) {
                    dupe = payload
                } else {
                    dupe = Object.assign({}, payload)
                }
                context.onMessage.call(context, topic, dupe)
            }
        })
    }
}

export const Hub = new SimplePubSubHub()
const hub = Hub

/* id generation for templating */
let idcount = 0
const makeid = (prefix) => `${prefix || "gen"}${idcount++}`

export class ShadowComponent extends HTMLElement {
    constructor(id) {
        super()
        const name = this.constructor.name.toLowerCase()
        this.id = id || makeid(name)
        this.attachShadow({ mode: "open" })
        this.__template = document.createElement("template")
        this.__template.innerHTML = this.__proto__.constructor.template()
        this.shadowRoot.appendChild(this.__template.content.cloneNode(true))
        this.__initialized = false
        this.topics = []
        this.routes = []
    }

    listen() {
        hub.subscribe(this.topics, this)
    }

    connectedCallback() {
        this.listen()
        this.bindRoutes()
    }

    disconnectedCallback() {
        hub.unsubscribe(this.topics, this)
    }

    publish(topic, payload) {
        hub.publish(topic, payload)
    }

    onMessage() {
        console.log("override this method")
    }

    hide() { 
        if( ! this.classList.contains("hidden") ) {
            this.classList.add("hidden")
        }
    }

    show() {
        if( this.classList.contains("hidden") ) {
            this.classList.remove("hidden")
        }
    }

    toggle() {
        if( this.classList.contains("hidden") ) {
            this.classList.remove("hidden")
        } else {
            this.classList.add("hidden")
        }
    }

    onRoute() {
        // override this
    }

    bindRoutes() {
        function handleRouteChange() {
            const currentRoute = window.location.hash;
            this.routes.forEach(pattern => {
                if (currentRoute.match(pattern)) {
                    this.onRoute(pattern)
                }
            });
        }
        if (this.routes.length === 0) return
        window.addEventListener('hashchange', handleRouteChange.bind(this))
    }
}



export class Component extends HTMLElement {
    constructor(id) {
        super()
        const name = this.constructor.name.toLowerCase()
        this.id = id || makeid(name)
        this.__hub = hub
        this.__initialized = false
    }

    listen() {
        hub.subscribe(this.topics, this)
    }

    connectedCallback() {
        this.__template = document.createElement("template")
        this.__template.innerHTML = this.__proto__.constructor.template(this.dataset)
        this.appendChild(this.__template.content.cloneNode(true))
        this.listen()
        this.bindRoutes()
    }

    disconnectedCallback() {
        hub.unsubscribe(this.topics, this)
    }

    publish(topic, payload) {
        hub.publish(topic, payload)
    }

    onMessage() {
        console.log("override this method")
    }

    hide() { 
        if( ! this.classList.contains("hidden") ) {
            this.classList.add("hidden")
        }
    }

    show() {
        if( this.classList.contains("hidden") ) {
            this.classList.remove("hidden")
        }
    }

    toggle() {
        if( this.classList.contains("hidden") ) {
            this.classList.remove("hidden")
        } else {
            this.classList.add("hidden")
        }
    }

    onRoute() {
        // override this
    }

    bindRoutes() {
        function handleRouteChange() {
            const currentRoute = window.location.hash;
            this.routes.forEach(pattern => {
                if (currentRoute.match(pattern)) {
                    this.onRoute(pattern)
                }
            });
        }
        if (this.routes.length === 0) return
        window.addEventListener('hashchange', handleRouteChange.bind(this))
    }
}