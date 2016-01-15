//
// Function to apply a reducer/stat to raster zones
//
function RasterZoneStats(imCollection,zones,reducer,clipRegions,timeStampName,
timeStampFormat,scale){
  // decide reduceRegion scale which impacts the computation time significantly
  if (scale === undefined){
    //use the finer scale of imCollection and zones
    var icScale = ee.Image(imCollection.first()).projection().nominalScale().getInfo();
    //print('Image Collection Scale',icScale);
    var zoneScale = zones.projection().nominalScale().getInfo();
    //print('Zone raster scale',zoneScale);
    scale =Math.min(icScale,zoneScale);
  }
  print("RasterZoneStats() scale:", scale);

  // get the footprints of the image collection and zone raster
  var fpIc=ee.Image(imCollection.first()).geometry();

  var fpZone=zones.geometry();
  print("IC footprint",fpIc);
  print('Zone footprint',fpZone);

  // map function that reduce the regions for each image
  var fcOfFcs=imCollection.map(function(im){
    var numOfBands=im.bandNames().length();
    var imWithZones = im.addBands(zones);

    // Using group reducer to reduce on raster zones.
    //var clipRegions=zones.geometry();
    var d = imWithZones.reduceRegion(reducer.group({groupField: numOfBands,groupName: 'Zone',}),
            clipRegions, scale);

    //make a list of features (with no geometry) from returned dictionary
    var zoneList=ee.List(d.get('groups'));
    var fList=zoneList.map(function(e){
      return ee.Feature(null,e);
    });
    // make a feature collection from the dumb features
    var fcOut = ee.FeatureCollection(fList);

    // add image start and end time stamp to the features
    var imPropertyNames=im.propertyNames();
    if(imPropertyNames.contains("system:time_start")){
      var imStartDate = ee.Date(im.get("system:time_start")).format(timeStampFormat);
      fcOut = fcOut.map(function(feat) {
        return feat.set(timeStampName+"_start",imStartDate);
      });
    }
    if(imPropertyNames.contains("system:time_end")){
      var imEndDate = ee.Date(im.get("system:time_end")).format(timeStampFormat);
      fcOut = fcOut.map(function(feat) {
          return feat.set(timeStampName+"_end",imEndDate);
        });
    }
    return fcOut;
});

  // flatten the FC of FC
  var fc=ee.FeatureCollection(fcOfFcs).flatten();
  return fc;
