import { showModal } from './my-modal.js'

const style =
    /* css */`
    fieldset {
        border: 1px solid #ddd;
        border-radius: 5px;
        padding: 10px;
        margin-bottom: 20px;
        position: relative;
    }
    
    legend {
        padding: 5px 10px;
        border-radius: 5px;
        font-weight: 600;
    }
    
    label {
        display: block;
        margin-top: 10px;
    }
    
    .range-slider {
        margin: 10px 0 0 0;
    }
    
    .range-slider {
        width: 100%;
    }
    
    .range-slider__range {
        -webkit-appearance: none;
        width: calc(100% - (73px));
        height: 10px;
        border-radius: 5px;
        background: #d7dcdf;
        outline: none;
        padding: 0;
        margin: 0;
    }
    
    .range-slider__range::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #2c3e50;
        cursor: pointer;
        -webkit-transition: background 0.15s ease-in-out;
        transition: background 0.15s ease-in-out;
    }
    
    .range-slider__range::-webkit-slider-thumb:hover {
        background: #1abc9c;
    }
    
    .range-slider__range:active::-webkit-slider-thumb {
        background: #1abc9c;
    }
    
    .range-slider__range::-moz-range-thumb {
        width: 20px;
        height: 20px;
        border: 0;
        border-radius: 50%;
        background: #2c3e50;
        cursor: pointer;
        -moz-transition: background 0.15s ease-in-out;
        transition: background 0.15s ease-in-out;
    }
    
    .range-slider__range::-moz-range-thumb:hover {
        background: #1abc9c;
    }
    
    .range-slider__range:active::-moz-range-thumb {
        background: #1abc9c;
    }
    
    .range-slider__range:focus::-webkit-slider-thumb {
        box-shadow: 0 0 0 3px #fff, 0 0 0 6px #1abc9c;
    }
    
    .range-slider__value {
        display: inline-block;
        position: relative;
        width: 60px;
        color: #fff;
        line-height: 20px;
        text-align: center;
        border-radius: 3px;
        background: #2c3e50;
        padding: 5px 10px;
        margin-left: 8px;
    }

    .range-slider__value:after {
        position: absolute;
        top: 8px;
        left: -7px;
        width: 0;
        height: 0;
        border-top: 7px solid transparent;
        border-right: 7px solid #2c3e50;
        border-bottom: 7px solid transparent;
        content: "";
    }
    
    ::-moz-range-track {
        background: #d7dcdf;
        border: 0;
    }

    input::-moz-focus-inner,
    input::-moz-focus-outer {
        border: 0;
    }

    .avg_wrap {
        /* display: flex; */
        display: none;
        justify-content: flex-end;
        margin-top:20px;;
    }

    .avg_wrap span {
        margin-top:4px;
        background-color: gray
    }
    
    .avg_wrap span::after {
        border-color: gray;
    }
    
    fieldset span.material-symbols-outlined {
        position: absolute;
        top:-10px;
        left:-90px;
        font-size:500%;
        color: rgba(26, 188, 156, 0.5);
    }

    @media only screen and (max-width: 820px) {
        fieldset span.material-symbols-outlined {
            display: none;
        }
    }
    
    span.info {
        cursor: pointer;
        color: #007bff;
    }
    `

const newstyle = document.createElement('style')
newstyle.id = 'style_FormSection'
newstyle.innerHTML = style
document.head.appendChild(newstyle)

class FormSection extends HTMLElement {
    constructor() {
        super()
        this._name = this.getAttribute('data-ref')
        this._data = JSON.parse(localStorage.getItem("facets") || "[]").filter(f=>f.facet===this._name)[0]
        this.innerHTML = FormSection.template(this._data)
    }

    connectedCallback() {
        this._info = this.querySelectorAll('span.info')
        this._info.forEach(el => {
            el.onclick = (e) => {
                const sk = e.target.getAttribute('skill')
                const dc = e.target.getAttribute('description')
                const eg = e.target.getAttribute('example')
                showModal(this.modalContent(sk, dc, eg))
            }
        })
        this.addListeners()
    }

    static template_row(facetId, skill) {
        return /* html */`
        <div class="range-slider">
            <label for="${facetId}:${skill.id}">${skill.name} <span class="info" skill="${skill.name}" description="${skill.description}" example="${skill.example}" href="#">&#9432;</span></label>
            <input class="range-slider__range" facetId="${facetId}" name="${facetId}:${skill.id}" type="range" value="5" min="1" max="10" step="1">
            <span class="range-slider__value">5</span>
        </div>`
    }

    static template(data) {
        return /* html */`
        <fieldset>
            <span class="material-symbols-outlined">${data.icon}
            </span>
            <legend>${data.facet}</legend>
            ${data.skills.map(i => FormSection.template_row(data.id, i)).join('')}
            <div class="avg_wrap">
                <label>Average: </label>
                <span id="${data.id}_average" class="range-slider__value">5</span>
            </div>
        </fieldset>`
    }

    addListeners() {
        this.rangeSlider()
    }

    rangeSlider() {
        const sliders = this.querySelectorAll('.range-slider')
        sliders.forEach(function (slider) {
            const range = slider.querySelector('.range-slider__range')
            const value = slider.querySelector('.range-slider__value')

            value.textContent = range.value

            range.addEventListener('input', function () {
                value.textContent = this.value
                updateAverage(this.getAttribute('facetId'))
            })
        })
    }

    modalContent(skill, desc, example) {
        return /* html */`
        <h2 style="padding-bottom:10px; border-bottom: 1px lightgray solid;" >${skill}</h2>
        <p>
        <b>Description</b><br />
        ${desc}<br/><br/>
        <b>Example</b><br />
        ${example}
        </p>
        `
    }
}



function updateAverage(facetId) {
    let total = 0
    let count = 0
    const inputs = document.querySelectorAll(`input[facetId="${facetId}"]`)
    inputs.forEach(function (input) {
        total += parseInt(input.value)
        count++
    })
    const average = total / count
    document.getElementById(facetId + '_average').innerText = average.toFixed(2)
}

customElements.define('form-section', FormSection)
