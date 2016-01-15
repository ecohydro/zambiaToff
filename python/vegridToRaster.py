# Calculate areas in veggrid intersect and create raster of areas for each
# vegetation type in each 1km^2 cell

import arcpy
import time

try:
    bpath='C:\\Users\\lestes\\Dropbox\\publications\\zambiaToff\\private\\zambiaToff\\external\\input_devel\\biodiversity'
    inshp=bpath+ "\\veggrid.shp"

    print "Started script at " + time.strftime("%d %H:%M:%S")
    fldname="CAT"
    myList = set((row.getValue(fldname) for row in arcpy.SearchCursor(inshp, fields=fldname)))
    e=arcpy.Describe(inshp).extent  # extent of inshape
    arcpy.env.extent = "%s %s %s %s" %(e.XMin, e.YMin, e.XMax, e.YMax)

    for i in myList:

        print "Processing veg type " + str(i)

        # Variables
        fstr = "veg" + str(i)
        fnm = bpath + "\\" + fstr + ".tif"
        shpnm = "results" + str(i)# bpath + "\\" + fstr + ".shp"
        query = "\"CAT\"="+str(i)

        # Subset polygons and add area column to it, calculate area
        print "..calculating areas"
        arcpy.FeatureClassToFeatureClass_conversion(inshp, "in_memory", shpnm, query)
        arcpy.AddField_management(shpnm, "area", "INTEGER", 0, 3)
        arcpy.CalculateField_management(shpnm, "area", "!shape.Area@hectares!", "PYTHON_9.3")

        # Finally, write out area to raster
        print "..writing raster"
        arcpy.PolygonToRaster_conversion(shpnm, "area", fnm, "MAXIMUM_AREA", "area", 1000)

    print "Finished script at " + time.strftime("%d %H:%M:%S")

except Exception:
    e = sys.exc_info()[1]
    print(e.args[0])
