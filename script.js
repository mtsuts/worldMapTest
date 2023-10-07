d3.json('data.json').then((data) => {
  const mapContainer = '.map-container'
  map(mapContainer, data)
})
