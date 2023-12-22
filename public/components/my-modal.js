let modal, overlay, modalContent

const style = document.createElement('style')
style.id = 'style_MyModal'
style.innerHTML =
/* css */`
my-modal {
    display: none;
}
modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1009;
}
modal-container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 1010;
    min-width: 490px;
}`

document.head.appendChild(style)

class MyModal extends HTMLElement {
    constructor() {
        super()
        this.innerHTML = MyModal.template()
    }

    connectedCallback() {
        modal = this
        overlay = this.querySelector('modal-overlay')
        modalContent = this.querySelector('modal-content')

        overlay.addEventListener('click', () => MyModal.hideModal())
    }

    static template() {
        return /* html */`
        <modal-overlay></modal-overlay>
        <modal-container>
            <modal-content></modal-content>
        </modal-container>`
    }

    static showModal(content) {
        modalContent.innerHTML = content
        modal.style.display = 'block'
    }

    static hideModal() {
        modal.style.display = 'none'
    }
}

customElements.define('my-modal', MyModal)

export const showModal = MyModal.showModal
export const hideModal = MyModal.hideModal