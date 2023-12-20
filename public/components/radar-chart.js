const MAX_RADIUS = 200
const MAX_WIDTH = 680

class RadarChart extends HTMLElement {
    constructor() {
        super()
        this.innerHTML =
        /* html */`
        <div class="container" style="position: relative">
            <div class="legend-container"></div>
            <div style="margin: auto" class="svg-container">
        </div>`
        this.props = {}
    }

    // eslint-disable-next-line no-unused-vars
    attributeChangedCallback(name, oldValue, newValue) {
        if (this.chart) {
            this.chart.destroy()
            this.chart = null
        }
    }

    connectedCallback() {
        this._data = {
            charts: [{
                'facet': 'Technical Expertise',
                'score': '6.6'
            }, {
                'facet': 'Leadership Skills',
                'score': '6.6'
            }, {
                'facet': 'Communication Skills',
                'score': '6.6'
            }, {
                'facet': 'Problem-Solving Abilities',
                'score': '6.6'
            }, {
                'facet': 'Project Management Skills',
                'score': '6.6'
            }, {
                'facet': 'Adaptability and Learning Ability',
                'score': '6.6'
            }, {
                'facet': 'Mentorship and Coaching Skills',
                'score': '6.6'
            }
            ]
        }

        this.render()
    }

    render() {
        const myColors = [
            'rgba(52, 152, 219, 0.4)', // Vivid Blue
            'rgba(46, 204, 113, 0.4)', // Emerald Green
            'rgba(241, 196, 15, 0.4)', // Sunflower Yellow
            'rgba(231, 76, 60, 0.4)', // Bright Red

            'rgba(155, 89, 182, 0.4)', // Amethyst Purple
            'rgba(26, 188, 156, 0.4)', // Turquoise
            'rgba(230, 126, 34, 0.4)', // Orange
            'rgba(52, 73, 94, 0.4)', // Asbestos Gray
            'rgba(192, 57, 43, 0.4)', // Pomegranate Red
            'rgba(149, 165, 166, 0.4)' // Concrete Gray
        ]

        const _data = {
            charts: [{
                'facet': 'Technical Expertise',
                'score': '6.6'
            }, {
                'facet': 'Leadership Skills',
                'score': '6.6'
            }, {
                'facet': 'Communication Skills',
                'score': '6.6'
            }, {
                'facet': 'Problem-Solving Abilities',
                'score': '6.6'
            }, {
                'facet': 'Project Management Skills',
                'score': '6.6'
            }, {
                'facet': 'Adaptability and Learning Ability',
                'score': '6.6'
            }, {
                'facet': 'Mentorship and Coaching Skills',
                'score': '6.6'
            }
            ]
        }

        const dataSets = [
            _data.charts.map(() => 8.5),
            _data.charts.map(e => e.score)
        ]

        const dimensions = 7 // todo - derive from data
        const options = {
            width: 900,
            height: 900,
            padding: 110,
            levels: 5,
            maxValue: 10,
            labels: ['Technical Expertise', 'Leadership', 'Communication', 'Problem-Solving', 'Project Management', 'Adaptability and Learning', 'Mentorship and Coaching'],
            colors: myColors
        }
        RadarChart.draw(document.querySelector('.svg-container'), dataSets, dimensions, options)
        const initialVisibility = dataSets.map(() => true)
        RadarChart.createLegend(document.querySelector('.legend-container'), dataSets, myColors, initialVisibility)
    }

    static drawRadarAxes(svg, center, radius, dimensions, labels) {
        const angleSlice = (Math.PI * 2) / dimensions
        const scaleFactor = (radius / MAX_RADIUS)
        for (let i = 0; i < dimensions; i++) {
            const angle = angleSlice * i
            const x = center.x + radius * Math.cos(angle)
            const y = center.y + radius * Math.sin(angle)

            // Draw axes
            const line = document.createElementNS(svg.namespaceURI, 'line')
            line.setAttribute('x1', center.x)
            line.setAttribute('y1', center.y)
            line.setAttribute('x2', x)
            line.setAttribute('y2', y)
            line.setAttribute('stroke', 'lightgray')
            line.setAttribute('stroke-width', '1')
            svg.appendChild(line)

            // Adjusted axis labels positioning
            let labelRadiusOffset = 20 * scaleFactor// Default offset
            // Increase offset for labels on the left (π) and right (0, 2π) sides
            if (angle < 0.0001 || Math.abs(angle - Math.PI) < 1.0001 || Math.abs(angle - 2 * Math.PI) < 0.0001) {
                labelRadiusOffset = (radius / 200) * 50
            }
            // Decrease offset for labels on the top (π/2) and bottom (3π/2)
            if (Math.abs(angle - Math.PI / 2) < 0.0001 || Math.abs(angle - 3 * Math.PI / 2) < 0.0001) {
                labelRadiusOffset = (radius / 200) * 10
            }

            const labelRadius = radius + labelRadiusOffset
            const labelX = center.x + labelRadius * Math.cos(angle)
            const labelY = center.y + labelRadius * Math.sin(angle)

            const text = document.createElementNS(svg.namespaceURI, 'text')
            text.setAttribute('x', labelX)
            text.setAttribute('y', labelY)
            text.setAttribute('text-anchor', 'middle')
            text.setAttribute('alignment-baseline', 'central')
            text.setAttribute('font-size', scaleFactor * 9)
            // eslint-disable-next-line quotes
            text.setAttribute('font-family', "'Roboto', sans-serif")
            text.textContent = labels[i]
            svg.appendChild(text)
        }
    }

    static drawRadarLevels(svg, center, radius, levels, dimensions, maxValue) {
        const angleSlice = (Math.PI * 2) / dimensions
        const scaleFactor = (radius / MAX_RADIUS)

        for (let level = 1; level <= levels; level++) {
            const levelPoints = []
            for (let i = 0; i < dimensions; i++) {
                const angle = angleSlice * i
                const x = center.x + radius * (level / levels) * Math.cos(angle)
                const y = center.y + radius * (level / levels) * Math.sin(angle)
                levelPoints.push(`${x},${y}`)
            }
            // Close the loop by adding the first point at the end
            levelPoints.push(levelPoints[0])

            const levelLine = document.createElementNS(svg.namespaceURI, 'polyline')
            levelLine.setAttribute('points', levelPoints.join(' '))
            levelLine.setAttribute('fill', 'none')
            levelLine.setAttribute('stroke', 'lightgrey')
            levelLine.setAttribute('stroke-width', '1')
            svg.appendChild(levelLine)

            const levelRadius = radius * ((level) / levels)

            const levelValue = Math.round(maxValue * ((level) / levels))
            const tickLabel = document.createElementNS(svg.namespaceURI, 'text')
            tickLabel.setAttribute('x', center.x + levelRadius - 4)
            tickLabel.setAttribute('y', center.y)
            tickLabel.setAttribute('text-anchor', 'start')
            tickLabel.setAttribute('alignment-baseline', 'middle')
            tickLabel.setAttribute('font-size', 8 * scaleFactor)
            tickLabel.textContent = levelValue
            svg.appendChild(tickLabel)
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
            rect.setAttribute('x', center.x + levelRadius - 6 * scaleFactor)
            rect.setAttribute('y', center.y - 6 * scaleFactor)
            rect.setAttribute('width', 10 * scaleFactor)
            rect.setAttribute('height', 10 * scaleFactor)
            rect.setAttribute('fill', 'white')
            svg.insertBefore(rect, tickLabel)
        }
    }

    static drawRadarData(svg, center, radius, dataSets, maxValue, dimensions, colors) {
        const angleSlice = (Math.PI * 2) / dimensions

        dataSets.forEach((data, dataSetIndex) => {
            const points = data.map((value, i) => {
                const angle = angleSlice * i
                const x = center.x + (radius * value / maxValue) * Math.cos(angle)
                const y = center.y + (radius * value / maxValue) * Math.sin(angle)
                return `${x},${y}`
            }).join(' ')

            const polygon = document.createElementNS(svg.namespaceURI, 'polygon')
            polygon.setAttribute('points', points)
            polygon.setAttribute('stroke', colors[dataSetIndex])
            polygon.setAttribute('stroke-width', '2')
            polygon.setAttribute('fill', colors[dataSetIndex])
            polygon.setAttribute('class', `radar-dataset radar-dataset-${dataSetIndex}`)

            // Hover effect
            polygon.addEventListener('mouseenter', () => {
                polygon.style.fill = colors[dataSetIndex + 6] // More opacity on hover
            })
            polygon.addEventListener('mouseleave', () => {
                polygon.style.fill = colors[dataSetIndex] // Reset opacity
            })

            svg.appendChild(polygon)
        })
    }

    static createLegend(container, dataSets, colors, initialVisibility) {
        container.innerHTML = ''
        const legend = document.createElement('div')
        legend.setAttribute('class', 'radar-legend')

        // Function to position the legend
        function positionLegend() {
            const svgWrap = document.querySelector('.svg-container')
            const scaleFactor = svgWrap.getBoundingClientRect().width / MAX_WIDTH

            legend.style.position = 'absolute'
            legend.style.top = `${20 * scaleFactor}px`
            legend.style.right = `${10 * scaleFactor}px`
        }


        function resizeLegend() {
            // Clear the legend and reposition it
            legend.innerHTML = ''
            positionLegend()

            dataSets.forEach((_, dataSetIndex) => {
                const label = document.createElement('label')
                const checkbox = document.createElement('input')
                checkbox.type = 'checkbox'
                checkbox.checked = initialVisibility[dataSetIndex]
                checkbox.dataset.index = dataSetIndex

                checkbox.addEventListener('change', (e) => {
                    const index = e.target.dataset.index
                    const polygons = document.querySelectorAll(`.radar-dataset-${index}`)
                    polygons.forEach(polygon => {
                        polygon.style.display = e.target.checked ? '' : 'none'
                    })
                })

                const colorBox = document.createElement('span')
                colorBox.style.backgroundColor = colors[dataSetIndex]
                colorBox.style.display = 'inline-block'
                colorBox.style.width = '12px'
                colorBox.style.height = '12px'
                colorBox.style.marginRight = '5px'
                colorBox.style.border = '1px solid #000'

                label.appendChild(checkbox)
                label.appendChild(colorBox)
                label.appendChild(document.createTextNode(`Dataset ${dataSetIndex + 1}`))
                legend.appendChild(label)
            })

            container.appendChild(legend)
        }

        // Initial drawing and positioning
        resizeLegend()

        // Handle window resize events
        window.addEventListener('resize', resizeLegend)
    }

    static draw(container, dataSets, dimensions, options) {
        const { levels, maxValue, labels, padding, colors } = options

        const resizeSVG = () => {
            const width = container.clientWidth
            const scaleFactor = width / MAX_WIDTH

            const radius = width / 2 - padding * scaleFactor
            const center = { x: width / 2, y: width / 2 }

            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
            svg.setAttribute('width', width)
            svg.setAttribute('height', width)

            container.innerHTML = ''

            this.drawRadarAxes(svg, center, radius, dimensions, labels)
            this.drawRadarLevels(svg, center, radius, levels, dimensions, maxValue)
            this.drawRadarData(svg, center, radius, dataSets, maxValue, dimensions, colors)

            container.appendChild(svg)
        }

        // Initial drawing
        resizeSVG()

        // Handle window resize events
        window.addEventListener('resize', resizeSVG)
    }
}



customElements.define('radar-chart', RadarChart)