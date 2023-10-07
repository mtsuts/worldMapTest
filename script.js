Promise.all([d3.json('geo.json'), d3.json('GDP.json')]).then((data) => {
  const mapContainer = '.map-container'
  map(mapContainer, data[0])
})
