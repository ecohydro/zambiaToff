import arcpy
import time

try:
    rpath = 'C:\\Users\\lestes\\Dropbox\\'
    vpath = rpath + 'publications\\zambiaToff\\private\\zambiaToff\\' + \
        'external\\input_devel\\vegetation\\'
    itiff = rpath + 'data\\landcover\\' + 'Zambia_LandCover_2010_Scheme_II\\'
    shp = rpath + 'data\\distributions\\vegetation\\' + \
        'potential\\vecea\\Zambia\\pnv_vecea_v2_0_Zambia.shp'
    otiff = rpath + vpath + 'vecea.tif'

    e=arcpy.Describe(gtiff).extent
    arcpy.env.extent = "%s %s %s %s" %(e.XMin, e.YMin, e.XMax, e.YMax)

    arcpy.PolygonToRaster_conversion(shp, "CAT", otiff, "MAXIMUM_AREA", "CAT", \
        0.0002778558)

except Exception:
    e = sys.exc_info()[1]
    print(e.args[0])
