function map(mapContainer, data) {

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
  const features = svg.append("g");

  // Bind the GeoJSON data to path elements and draw them
  features.selectAll("path")
    .data(data.features)
    .enter()
    .append("path")
    .attr("d", path)
    .style('fill', "#6495e3")
    .style('opacity', 0.5)
    .attr('cursor', 'pointer')
    .attr('stroke', '#fafafa')
    .attr('stroke-width', 0.7)
    .on('click', clicked)


  const zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on("zoom", zoomed);


  svg.call(zoom)

  function zoomed(event) {
    const { transform } = event;
    features.attr("transform", transform);
  }


  function reset() {
    d3.selectAll('path').transition().style('fill', '#6495e3')
    svg.transition().duration(750).call(
      zoom.transform,
      d3.zoomIdentity,
      d3.zoomTransform(svg.node()).invert([params.width / 2, params.height / 2])
    );
  }

  function clicked(event, d) {
    const [[x0, y0], [x1, y1]] = path.bounds(d);
    event.stopPropagation();
    d3.selectAll('path').transition().style('fill', "#6495e3")
    d3.select(this).transition().style('fill', 'red')
    svg.transition().duration(750).call(
      zoom.transform,
      d3.zoomIdentity
        .translate(params.width / 2, params.height / 2)
        .scale(Math.min(2, 0.9 / Math.max((x1 - x0) / params.width, (y1 - y0) / params.height)))
        .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
      d3.pointer(event, svg.node())
    );
  }

}