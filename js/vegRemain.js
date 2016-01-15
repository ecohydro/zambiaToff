// EarthEngine script to filter out converted areas from VECEA potential veg
var vecea = ee.Image('users/lyndonestes/africa/vecea');
var lc = ee.Image('users/lyndonestes/africa/zambia_lc_2010_II');
var zamgrid = ee.Image('users/lyndonestes/africa/zamgrid');
var zambia = ee.FeatureCollection('ft:10YdSHdN3XgDoRFDyPLecjjyV_5iQqGEymorahxMD', 'geometry');

// select out converted areas or water bodies
var cropland = lc.eq(8);
var settled = lc.eq(11);
var water = lc.eq(10);
var convtotal = cropland.add(settled); // converted areas

// start changing potential vegetation
var vegactual = vecea.where(convtotal.eq(1), 0); // remove crop+urban
var vegactual = vegactual.where(vegactual.eq(255), 0); // set 255 to 0

var zoneScale = vegactual.projection().nominalScale().getInfo();

Export.image(vegactual, 'vegremain', {
  region: zambia,
  scale: zoneScale,
  maxPixels: 1500000000
});
