Promise.all([d3.json('geo.json'), d3.json('unis.json')]).then((data) => {
  const mapContainer = '.map-container'
  // const newData = data[0].features.map(d => {
  //   return {
  //     ...d,
  //     gdp: data[1].find(x => x.country === d.properties.name),
  //   }
  // })
  // .filter(d => d.gdp !== undefined)

  // const updatedData = {
  //   type: 'FeatureCollection',
  //   features: newData
  // }
  const unisData = data[1].map(d => {
    return {
      ...d,
      successRate: d['Success rate']
    }
  })
  const fields = unisData.map(d => d['Area of study'])

  d3.select('.legend-container')
    .selectAll('button')
    .data(fields)
    .enter()
    .append('button')
    .text((d) => d)
    .style('color', 'blue')
    .style('display', 'flex')

  map(mapContainer, data[0], unisData)
})
