// EarthEngine code to create steep slope mask for Zambia

// Load in SRTM 30 m for Africa and Zambia shapefile
var dem = ee.Image('USGS/SRTMGL1_003');
var zambia = ee.FeatureCollection('ft:10YdSHdN3XgDoRFDyPLecjjyV_5iQqGEymorahxMD', 'geometry');
var zamgrid = ee.Image('users/lyndonestes/africa/zamgrid');

// Calculate slope, clip down to Zambia, and then convert to percent
var slope = ee.Terrain.slope(dem);
var slopedeg = slope.clip(zambia);
var slopepct = slopedeg.expression('tan(slope * 3.141593 / 180) * 100', {
  'slope': slopedeg.select('slope')
});

var zoneScale = slopepct.projection().nominalScale().getInfo();

// Filter out steep areas
var farmable = slopepct.lte(20);

Export.image(farmable, 'farmable', {
  region: zambia,
  scale: zoneScale,
  maxPixels: 1500000000
});
