Promise.all([d3.json('geo.json'), d3.json('GDP.json')]).then((data) => {
  const mapContainer = '.map-container'

  const newData = data[0].features.map(d => {
    return {
      ...d,
      gdp: data[1].find(x => x.country === d.properties.name),
      unis: data[2]
    }
  }).filter(d => d.gdp !== undefined)

  const updatedData = {
    type: 'FeatureCollection',
    features: newData
  }
  map(mapContainer, updatedData)
})


const width = 800;
const height = 400;

const svg = d3.select("#globe-container")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// Define a projection for the globe
const projection = d3.geoOrthographic()
  .scale(height / 2)
  .translate([width / 2, height / 2]);

const path = d3.geoPath().projection(projection);

// Create a circle for the globe
svg.append("path")
  .datum({ type: "Sphere" })
  .attr("class", "globe")
  .attr("d", path);


d3.json("/geo-json").then(function (data) {
  // Append the countries to the globe
  svg.selectAll("path")
    .data(data.features)
    .enter()
    .append("path")
    .attr("class", "country")
    .attr("d", path);
});