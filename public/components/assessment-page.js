
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
        padding: 20px;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        margin: auto;
    }

    article:first-of-type {
        padding: 60px;
    }
    
    article:last-of-type {
        padding: 0;
    }

    input[type=text] {
        border: none;
        background-color: #eee;
        padding: 5px;
        text-align: center;
    }
    
    input[type=submit] {
        background-color: #4f8fd3;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        margin-top: 10px;
    }
    
    input[type=submit]:hover {
        background-color: #0056b3;
    }`

const styleEl = document.createElement('style')
styleEl.innerHTML = style
styleEl.id = 'style_AssessmentPage'
document.head.appendChild(styleEl)

class AssessmentPage extends HTMLElement {
    constructor() {
        super()
        this.innerHTML = AssessmentPage.template()
    }

    static template() {
        return /* html */`
        <article>
            <h2>Self-Assessment for Software Engineers</h2>
            <h4>Version 1.0 created Dec 16th 2023</h4>

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
        </article>

        <article>
            <form>
                <form-section data-ref="Technical Expertise"></form-section>
                <form-section data-ref="Leadership Skills"></form-section>
                <form-section data-ref="Communication Skills"></form-section>
                <form-section data-ref="Problem-Solving Abilities"></form-section>
                <form-section data-ref="Project Management Skills"></form-section>
                <form-section data-ref="Adaptability and Learning Ability"></form-section>
                <form-section data-ref="Mentorship and Coaching Skills"></form-section>
        
                <input type="submit" value="Save as Complete">
            </form>
        </article>
        
        <article>
            <radar-chart></radar-chart>
        </article>
`
    }

    connectedCallback() {
        const submitButton = document.querySelector('input[type="submit"]')
        submitButton.onclick = (e) => {
            e.preventDefault()
        }
    }
}


customElements.define('assessment-page', AssessmentPage)
