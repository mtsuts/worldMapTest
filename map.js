function map(mapContainer, data, unis) {

  const container = d3.select(mapContainer)

  const params = {
    width: container.node().getBoundingClientRect().width,
    height: 750,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
  }

  const svg = container
    .append('svg')
    .attr('height', params.height)
    .attr('width', params.width)
    .on("click", reset);

  // create projection
  const projection = d3.geoMercator()
    .fitSize([params.width, params.height], data)

  // create path
  const path = d3.geoPath().projection(projection);
  // Create a group for the map features
  const features = svg.append("g")

  // color scale for heatmap 
  // const colorScale = d3.scalePow()
  //   .domain([d3.min(data.features.map(d => d.gdp.unGDP)), d3.max(data.features.map(d => d.gdp.unGDP))])
  //   .range(["#ffa200", "#ff3300"]).exponent(0.3)


  // Bind the GeoJSON data to path elements and draw them
  features.selectAll("path")
    .data(data.features)
    .enter()
    .append("path")
    .attr("d", path)
    .style('fill', "#ffa200")
    .style('opacity', 0.7)
    .attr('cursor', 'pointer')
    .attr('stroke', '#fafafa')
    .attr('stroke-width', 0.7)
    .on('click', clicked)

  const zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on("zoom", zoomed);

  svg.call(zoom)

  // reset button click
  const resetBtn = d3.select('.reset-button').on('click', function () {
    reset()

  })

  function zoomed(event) {
    const { transform } = event;
    features.attr("transform", transform);
  }

  function reset() {
    d3.selectAll('path').transition().style('opacity', 0.7)
    console.log(d3.zoomTransform(svg.node()));
    svg.transition().duration(750).call(
      zoom.transform,
      d3.zoomIdentity,
    );
  }


  // zoom on click
  function clicked(event, d) {
    resetBtn.classed('hidden', false)
    const [[x0, y0], [x1, y1]] = path.bounds(d);
    event.stopPropagation();
    d3.selectAll('path').transition().style('opacity', 0.7)
    d3.select(this).transition().style('opacity', 1)
    svg.transition().duration(750).call(
      zoom.transform,
      d3.zoomIdentity
        .translate(params.width / 2, params.height / 2)
        .scale(Math.min(
          2,
          1 * Math.min(
            params.width / (x1 - x0),
            params.height / (y1 - y0)
          )))
        .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
      d3.pointer(event, svg.node())
    );
  }

  // circle radius scale
  const scaleRadius = d3.scaleLinear().domain([d3.min(unis.map(d => d.successRate)), d3.max(unis.map(d => d.successRate))]).range([20, 40])


  // adding circles on university coordinates 
  features.selectAll('circle')
    .data(unis)
    .enter()
    .append('circle')
    .attr('cx', (d) => projection([d.Longitude, d.Latitude])[0])
    .attr('cy', (d) => projection([d.Longitude, d.Latitude])[1])
    .attr('r', (d) => scaleRadius(d.successRate))
    .attr('fill', 'red')
    .attr('opacity', 0.4)
}