function map(mapContainer, data) {
  const container = d3.select(mapContainer)
  console.log(data)
  const svg = container
    .append('svg')
    .attr('height', 500)
    .attr('width', 500)
    .style('background-color', 'red')

  const g = svg.append('g').attr('transform', 'translate(10,10)')


}