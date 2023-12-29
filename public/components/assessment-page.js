import { MyWelcome } from './my-welcome.js'

const style =
    /* css */`
    h2, h3, h4 {
        text-align: center;
    }

    h4 {
        margin: -20px 0 0 0;
        color: gray;
        font-weight: 300;
    }

    form {
        margin: auto;
        max-width: 600px;
    }

    article {
        max-width: 800px;
        margin-bottom: 30px !important;
        background-color: white;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        margin: auto;
    }

    article:nth-of-type(1) {
        padding: 60px;
    }
    article:nth-of-type(2) {
        padding: 30px 20px;
    }
    article:nth-of-type(3) {
        padding: 0;
    }

    input[type=text] {
        border: none;
        background-color: #eee;
        padding: 5px;
        text-align: center;
    }`

const styleEl = document.createElement('style')
styleEl.innerHTML = style
styleEl.id = 'style_AssessmentPage'
document.head.appendChild(styleEl)

class AssessmentPage extends HTMLElement {
    constructor() {
        super()
        this.data = window._data

        const cookieData = JSON.parse(localStorage.getItem('user') || "{}")

        let mapping
        switch(cookieData.jobRole || 'unknown') {
            case "People Leader":
                mapping = "People Leader"
                break;
            case "Product Role":
            case "Project Role":
                mapping = "Product Owner"
                break;
            case "Mid Software Engineer":
            case "Senior Software Engineer":
            case "Lead Software Engineer":
            default:
                mapping = "Software Engineer"
                break;
        }

        this.facets = this.data.facets[mapping]

        localStorage.setItem("facets", JSON.stringify(this.facets))

        this.innerHTML = AssessmentPage.template(this.facets)
    }

    static template(facets, results=[]) {
        const row = (row) => `<form-section data-ref="${row.facet}"></form-section>`

        const firstCard = /* html */`
        <article>
            <h2>Self-Assessment for Software Engineers</h2>
            <h4>Version 1.0.1</h4>

            <h3>Overview</h3>
            <p>The Self-Assessment for Software Engineers is a multi-faceted tool designed to help professionals in the field of software engineering to introspectively analyze their skills and capabilities across seven key areas. These facets encompass the diverse set of skills required to excel in software engineering, ranging from technical knowledge to interpersonal abilities.</p>
            <p>Self-Assessment is not just a tool for self-evaluation but a catalyst for continuous growth and adaptation in a dynamic and challenging field. Regular self-reflection and assessment enable software engineers to thrive and excel in their careers while contributing effectively to their teams and organizations.</p>

            <h3>Scoring</h3>
            <dl>
                <dt><strong>Novice or Below Average (Score: 1-3)</strong></dt>
                <dd>
                    <ol start="1">
                        <li><strong>1:</strong> Very basic understanding or skill, indicative of a beginner or minimal exposure.</li>
                        <li><strong>2-3:</strong> Slightly higher than a beginner, foundational knowledge but lacks depth and practical experience.</li>
                    </ol>
                </dd>
        
                <dt><strong>Below Average to Moderate (Score: 4-5)</strong></dt>
                <dd>
                    <ol start="4">
                        <li><strong>4:</strong> Just below average, understands basics but struggles with complexity.</li>
                        <li><strong>5:</strong> Moderate or average level, competent with standard tasks, but not in more challenging situations.</li>
                    </ol>
                </dd>
        
                <dt><strong>Moderate to Proficient (Score: 6-7)</strong></dt>
                <dd>
                    <ol start="6">
                        <li><strong>6:</strong> Above average proficiency, competent in handling complex tasks.</li>
                        <li><strong>7:</strong> Solid proficiency, high comfort level with the skill, strong capabilities.</li>
                    </ol>
                </dd>
        
                <dt><strong>Highly Proficient to Expert (Score: 8-9)</strong></dt>
                <dd>
                    <ol start="8">
                        <li><strong>8:</strong> High proficiency and expertise, deep knowledge and experience.</li>
                        <li><strong>9:</strong> Near-mastery, expert level, capable of innovative solutions and leading others.</li>
                    </ol>
                </dd>
        
                <dt><strong>Mastery (Score: 10)</strong></dt>
                <dd>
                    <ol start="10">
                        <li><strong>10:</strong> Mastery level, exceptional expertise, thought leader, capable of groundbreaking work.</li>
                    </ol>
                </dd>
            </dl>
        </article>`

        const secondCard = /* html */` 
        <article>
            <form>
                ${facets.map(f=>row(f)).join('')}
                <button type="submit">Save as Complete</button>
            </form>
        </article>`

        return firstCard + secondCard
    }

    static template_results(facets, data) {
        return /* html */`
        <article>
            <h2>Self Assessment Results</h2>
            <radar-chart data-labels='${JSON.stringify(facets.map(f=>f.facet))}' data-values="${JSON.stringify(data)}", data-max="10" data-legend='["Results"]'></radar-chart>
        </article>`
    }

    connectedCallback() {
        const submitButton = this.querySelector('button[type="submit"]')
        if (submitButton) {
            const form = this.querySelector('form')
            submitButton.onclick = (e) => {
                e.preventDefault()
                const formData = new FormData(form)
                const formJson = Object.fromEntries(formData)
                const results = this.calculateResults(formJson)

                // hide assessment form
                document.querySelector('article:last-of-type').style.display = 'none'
                
                // save results locally
                const user = JSON.parse(localStorage.getItem("user") || "{}")
                user.lastAssessmentDate = (new Date()).toISOString()
                user.lastAssessmentResults = results
                localStorage.setItem("user", JSON.stringify(user))

                // send to server
                
                // get aggregates?

                // display results
                const d = document.createElement('div')

                const data = []
                for (let k in results) {
                    data.push(results[k].average)
                }
                d.innerHTML = AssessmentPage.template_results(this.facets, [data])
                this.appendChild(d)
            }
        }
    }

    calculateResults(formJson) {
        return Object.entries(formJson).reduce((acc, [key, value]) => {
            const facetId = key.split(':')[0]
            value = parseInt(value)

            if (!acc[facetId]) {
                acc[facetId] = { sum: 0, count: 0, average: 0 }
            }

            acc[facetId].sum += value
            acc[facetId].count += 1
            acc[facetId].average = acc[facetId].sum / acc[facetId].count

            return acc
        }, {})
    }
}


customElements.define('assessment-page', AssessmentPage)
