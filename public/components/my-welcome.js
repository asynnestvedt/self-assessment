import { Component } from './common.js'
import { showModal } from './my-modal.js'

class MyWelcome extends Component {
    constructor() {
        super()
        this.data = window._data // Assuming window._data is available and formatted correctly
        this.modalEl = document.querySelector('my-modal')
    }

    connectedCallback() {
        super.connectedCallback()
        this.populateFormWithCookies()
        this.addFormSubmitEventListener()
        this.addSelectChangeListeners()
    }

    buildSelectOptions(selectName, options) {
        const select = this.modalEl.querySelector(`select[name="${selectName}"]`)
        if (!select) return

        select.innerHTML = options.map(option => 
            `<option value="${option.value}">${option.text}</option>`
        ).join('')
    }

    populateFormWithCookies() {
        const form = this.modalEl.querySelector('form')
        ;['jobRole', 'teamName', 'person'].forEach(name => {
            const cookieValue = MyWelcome.getCookie(name)
            if (cookieValue) {
                form[name].value = cookieValue
                this.updateSelectState(name)
            }
        })
    }

    addSelectChangeListeners() {
        const form = this.modalEl.querySelector('form')
        form.jobRole.addEventListener('change', () => this.updateSelectState('jobRole'))
        form.teamName.addEventListener('change', () => this.updateSelectState('teamName'))
    }

    updateSelectState(selectName) {
        const form = this.modalEl.querySelector('form')
        switch (selectName) {
            case 'jobRole':
                this.updateOptions('teamName', this.data.teams.map(t => t.name))
                form.teamName.value = ''
                form.person.value = ''
                break
            case 'teamName':
                const team = this.data.teams.find(t => t.name === form.teamName.value)
                this.updateOptions('person', team ? team.members : [])
                form.person.value = ''
                break
        }
        this.updateDisabledState()
    }

    updateOptions(selectName, options) {
        this.buildSelectOptions(selectName, options.map(item => ({ value: item.name || item, text: item.name || item })))
    }

    updateDisabledState() {
        const form = this.modalEl.querySelector('form')
        form.teamName.disabled = !form.jobRole.value
        form.person.disabled = !form.teamName.value
        form.querySelector("button[type='submit']").disabled = !(form.teamName.value && form.jobRole.value && form.person.value)
    }

    addFormSubmitEventListener() {
        const form = this.modalEl.querySelector('form')
        form.addEventListener('submit', event => {
            event.preventDefault()
            if (this.validateForm(form)) {
                this.saveFormToCookies(form)
            }
        })
    }

    validateForm(form) {
        return true // Placeholder for actual validation logic
    }

    static template(data) {
        const cookie = MyWelcome.getCookie()

        const templateOption = (items, selectedValue) => items.map(item => 
            `<option value="${item.value}"${selectedValue === item.value ? " selected" : ""}>${item.label}</option>`
        ).join('')

        const content = /*html*/`
            <form>
                <h1>Welcome!</h1>
                <p>Please select your details:</p>
                <fieldset>
                    <label for="jobRole">Job Role</label>
                    <select name="jobRole">${templateOption(data.roles.map(role => ({label: role, value: role})), cookie['jobRole'])}</select>
                    <label for="teamName">Team Name</label>
                    <select name="teamName" disabled>
                        <option value="none">No Team Selected</option>
                    </select>
                    <label for="person">Individual Name</label>
                    <select name="person" disabled></select>
                    <p>By proceeding, you agree to the use of necessary browser cookies.</p>
                    <button type="submit" disabled>Go!</button>
                </fieldset>
            </form>`
        return content
    }

    saveFormToCookies(form) {
        ['jobRole', 'teamName', 'person'].forEach(name => {
            document.cookie = `${name}=${encodeURIComponent(form[name].value)}; path=/`;
        });
        this.modalEl.constructor.hideModal()
    }

    static getCookie() {
        return document.cookie.split('').reduce((cookies, cookie) => {
            const [name, value] = cookie.split('=').map(c => c.trim())
            cookies[name] = decodeURIComponent(value)
            return cookies
        }, {})
    }
}

customElements.define('my-welcome', MyWelcome)