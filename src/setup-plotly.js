import Plotly from 'plotly.js/lib/core'
import scatter from 'plotly.js/lib/scatter'
import bar from 'plotly.js/lib/bar'
import heatmap from 'plotly.js/lib/heatmap'

Plotly.register([scatter, bar, heatmap])

export default Plotly
