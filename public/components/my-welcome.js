import { showModal, hideModal } from "./my-modal.js"

export class MyWelcome extends HTMLElement {
    constructor() {
        super()
        this.data = window._data
        this.modalEl = document.querySelector("my-modal")
        showModal(MyWelcome.template(this.data))
    }

    connectedCallback() {
        this.populateFormFromStorage()
        this.addFormSubmitEventListener()
        this.addSelectChangeListeners()
    }

    buildSelectOptions(selectName, options) {
        const select = this.modalEl.querySelector(`select[name="${selectName}"]`)
        if (!select) return

        select.innerHTML = options.map(option => 
            `<option value="${option.value}">${option.text}</option>`
        ).join("")
    }

    populateFormFromStorage() {
        const form = this.modalEl.querySelector("form")
        const user = JSON.parse(localStorage.getItem("user")||"{}")
        ;["jobRole", "teamName", "person"].forEach(name => {
            if (user.hasOwnProperty(name)) {
                form[name].value = user[name]
                this.updateSelectState(name)
            }
        })
    }

    addSelectChangeListeners() {
        const form = this.modalEl.querySelector("form")
        form.jobRole.addEventListener("change", () => this.updateSelectState("jobRole"))
        form.teamName.addEventListener("change", () => this.updateSelectState("teamName"))
        // form.person.addEventListener("change", () => this.updateSelectState("person"))
    }

    updateSelectState(selectName) {
        const form = this.modalEl.querySelector("form")
        switch (selectName) {
            case "jobRole":
                this.updateOptions("teamName", this.data.teams.map(t => t.name))
                form.teamName.value = ""
                // form.person.value = ""
                break
            case "teamName":
                const team = this.data.teams.find(t => t.name === form.teamName.value)
                this.updateOptions("person", team ? team.members : [])
                // form.person.value = ""
                break
        }
        this.updateDisabledState()
    }

    updateOptions(selectName, options) {
        this.buildSelectOptions(selectName, options.map(item => ({ value: item.name || item, text: item.name || item })))
    }

    updateDisabledState() {
        const form = this.modalEl.querySelector("form")
        form.teamName.disabled = !form.jobRole.value
        // form.person.disabled = !form.teamName.value
        form.querySelector(`button[type="submit"]`).disabled = !(form.teamName.value && form.jobRole.value /** && form.person.value */)
    }

    addFormSubmitEventListener() {
        const form = this.modalEl.querySelector("form")
        form.addEventListener("submit", event => {
            event.preventDefault()
            if (this.validateForm(form)) {
                this.saveForm(form)
                hideModal()
                window.location = '#assessment'
            }
        })
    }

    validateForm(form) {
        return true // Placeholder for actual validation logic
    }

    static template(data) {
        const user = JSON.parse(localStorage.getItem("user") || "{}")

        const templateOption = (items, selectedValue) => items.map(item => 
            `<option value="${item.value}"${selectedValue === item.value ? " selected" : ""}>${item.label}</option>`
        ).join("")

        const content = /*html*/`
            <form>
                <h1>Welcome!</h1>
                <p>
                    You've been invited to take part in the software engineering self-assessment.
                    This is an experiment in professional development and your feedback is crucial to the success of this initiative. It's important to note that individual data is not reviewed or made visible elsewhere. Let's get started.
                </p>
                <fieldset>
                    <label for="jobRole">Job Role</label>
                    <select name="jobRole">${templateOption(data.roles.map(role => ({label: role, value: role})), user["jobRole"])}</select>
                    <label for="teamName">Team Name</label>
                    <select name="teamName" disabled>
                        <option value="none">No Team Selected</option>
                    </select>
                    <!--<label for="person">Individual Name</label>
                    <select name="person" disabled></select>-->
                    <p>By proceeding, you agree to the use of local storage for necessary application functionality.</p>
                    <button type="submit" disabled>Go!</button>
                </fieldset>
            </form>`
        return content
    }

    saveForm(form) {
        const formData = new FormData(form)
        const user = Object.fromEntries(formData)
        localStorage.setItem("user", JSON.stringify(user))
    }
}

customElements.define("my-welcome", MyWelcome)
