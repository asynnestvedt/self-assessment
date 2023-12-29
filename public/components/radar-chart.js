// used for scaling calculation
// TODO: detect these values
const MAX_RADIUS = 200
const MAX_WIDTH = 680

class RadarChart extends HTMLElement {
    constructor() {
        super()
        this.innerHTML =
        /* html */`
        <div class="container" style="position: relative">
            <div class="legend-container"></div>
            <div class="svg-container">
        </div>`
        this.props = {}
    }

    // eslint-disable-next-line no-unused-vars
    attributeChangedCallback(name, oldValue, newValue) {
        if (this.chart) {
            this.chart.destroy()
            this.chart = null
        }
        this.render()
    }

    connectedCallback() {
        this.render()
    }

    render() {
        const defaultColors = [
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

        

        const labels = JSON.parse(this.dataset.labels)
        const dimensions = labels.length
        const legend = JSON.parse(this.dataset.legend || "[]")
        const datasets = JSON.parse(this.dataset.values || "[[]]")
 
        this.options = {
            padding: parseInt(this.dataset.padding || "110"),
            levels: parseInt(this.dataset.levels || "5"),
            maxValue: parseInt(this.dataset.maxValue || "10"),
            labels: labels,
            colors: defaultColors
        }
        RadarChart.draw(document.querySelector('.svg-container'), datasets, dimensions, this.options)
        if (legend.length > 0) {
            const initialVisibility = datasets.map(() => true)
            RadarChart.createLegend(document.querySelector('.legend-container'), legend, this.options.colors, initialVisibility)
        }
    }

    static drawRadarAxes(svg, center, radius, dimensions, labels) {
        const angleSlice = (Math.PI * 2) / dimensions
        const scaleFactor = (radius / MAX_RADIUS)
        for (let i = 0; i < dimensions; i++) {
            const angle = angleSlice * i - Math.PI / 2
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
            let labelRadiusOffset
            // TODO: may need to find a generalizable way to specify the offset bases on the angle
            if ([-1.5707963267948966, 1.121997376282069, 2.019595277307724].includes(angle)) {
                labelRadiusOffset = (radius / 200) * 20;
            } else {
                labelRadiusOffset = (radius / 200) * 40;
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
                const angle = angleSlice * i - Math.PI / 2
                const x = center.x + radius * (level / levels) * Math.cos(angle)
                const y = center.y + radius * (level / levels) * Math.sin(angle)
                levelPoints.push(`${x},${y}`)
            }
            levelPoints.push(levelPoints[0])

            const levelLine = document.createElementNS(svg.namespaceURI, 'polyline')
            levelLine.setAttribute('points', levelPoints.join(' '))
            levelLine.setAttribute('fill', 'none')
            levelLine.setAttribute('stroke', 'lightgrey')
            levelLine.setAttribute('stroke-width', '1')
            svg.appendChild(levelLine)

            const levelRadius = radius * (level / levels);
            const levelValue = Math.round(maxValue * (level / levels));
            const tickAngle = Math.PI / 2; // Bottom axis angle
            const tickLabelX = center.x + levelRadius * Math.cos(tickAngle) * scaleFactor;
            const tickLabelY = center.y - levelRadius * Math.sin(tickAngle) + 8;
            
            const tickLabel = document.createElementNS(svg.namespaceURI, 'text');
            tickLabel.setAttribute('x', tickLabelX);
            tickLabel.setAttribute('y', tickLabelY);
            tickLabel.setAttribute('text-anchor', 'middle');
            tickLabel.setAttribute('alignment-baseline', 'bottom');
            tickLabel.setAttribute('font-size', 8 * scaleFactor);
            tickLabel.textContent = levelValue;
            svg.appendChild(tickLabel);
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
            rect.setAttribute('x', tickLabelX - 5.5 * scaleFactor)
            rect.setAttribute('y', tickLabelY - 7.5 * scaleFactor)
            tickLabel.setAttribute('text-anchor', 'middle');
            tickLabel.setAttribute('alignment-baseline', 'bottom');
            rect.setAttribute('width', 11 * scaleFactor)
            rect.setAttribute('height', 11 * scaleFactor)
            rect.setAttribute('fill', 'white')
            svg.insertBefore(rect, tickLabel)
        }
    }

    static drawRadarData(svg, center, radius, dataSets, maxValue, dimensions, colors) {
        const angleSlice = (Math.PI * 2) / dimensions

        dataSets.forEach((data, i) => {
            const points = data.map((value, i) => {
                const angle = angleSlice * i - Math.PI / 2
                const x = center.x + (radius * value / maxValue) * Math.cos(angle)
                const y = center.y + (radius * value / maxValue) * Math.sin(angle)
                return `${x},${y}`
            }).join(' ')

            const polygon = document.createElementNS(svg.namespaceURI, 'polygon')
            polygon.setAttribute('points', points)
            polygon.setAttribute('stroke', colors[i])
            polygon.setAttribute('stroke-width', '4')
            polygon.setAttribute('fill', colors[i])
            polygon.setAttribute('class', `radar-dataset radar-dataset-${i}`)

            polygon.addEventListener('mouseenter', () => {
                const altColor = colors[(i + 6) % colors.length]
                polygon.style.fill = altColor
                polygon.style.stroke = altColor
            })
            polygon.addEventListener('mouseleave', () => {
                const origColor = colors[i]
                polygon.style.fill = origColor
                polygon.style.stroke = origColor
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

            dataSets.forEach((_, i) => {
                const label = document.createElement('label')
                const checkbox = document.createElement('input')
                checkbox.type = 'checkbox'
                checkbox.checked = initialVisibility[i]
                checkbox.dataset.index = i

                checkbox.addEventListener('change', (e) => {
                    const index = e.target.dataset.index
                    const polygons = document.querySelectorAll(`.radar-dataset-${index}`)
                    polygons.forEach(polygon => {
                        polygon.style.display = e.target.checked ? '' : 'none'
                    })
                })

                const colorBox = document.createElement('span')
                colorBox.style.backgroundColor = colors[i]
                colorBox.style.display = 'inline-block'
                colorBox.style.width = '12px'
                colorBox.style.height = '12px'
                colorBox.style.marginRight = '5px'
                colorBox.style.border = '1px solid #000'

                label.appendChild(checkbox)
                label.appendChild(colorBox)
                label.appendChild(document.createTextNode(dataSets[i]))
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
