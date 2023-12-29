class AboutPage extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.innerHTML = AboutPage.template()
    }

    static template() {
        return /* html */`
        <article>
            <h2>The Value of Learning about Ourselves</h2>
            <p>
                Self-assessment is key in overcoming the Dunning-Kruger effect, where as individuals we overestimate our own skills. In software engineering, where technology changes rapidly, reflection helps identify true skill levels and areas needing development. This is crucial for growth, countering overconfidence and leading to a realistic view of one&2019;s abilities. Regular self-assessment fosters precision, continuous learning, and adaptation in this fast-paced field.
            </p>
            <h2>The Value of Learning from Others</h2>
            <p>
                Software engineering thrives on continuous learning and collaboration. For engineers, valuing colleagues' experiences offers unique insights beyond data or individual problem-solving. Embracing diverse perspectives broadens understanding of various approaches and techniques. This is vital in a field marked by rapidly evolving technologies and practices. By learning from others, engineers keep up with new trends, enhancing their adaptability and versatility.
            </p>
            <h2>Openness is a super-power</h2>
            <p>
                Self-assessment is crucial for software engineers to recognize their skill gaps and limitations. By understanding their own competencies, engineers are more likely to seek and value external advice and solutions. This openness, though not always natural in a precision-focused field, is key for professional growth. Regular self-assessment fosters continuous learning and humility, showing that there's always something to learn from others. Embracing this approach enhances personal skills and fosters a collaborative, innovative work environment
            </p>
        </article>`
    }

}

customElements.define('about-page', AboutPage)