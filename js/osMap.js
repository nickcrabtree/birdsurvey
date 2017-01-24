function init()
{
    var tetrad = location.search.substr(1); // Get rid of the question mark at the start
    var tetrad = tetrad.substr(0,5); // In case there's extra junk on the end

    // First convert input tetrad numbers and letters to an offset from the southwest corner of the OS letter square
    // (code from Indicia island_grid.php)
    var east = parseInt(tetrad.substr(2, 1));
    var north = parseInt(tetrad.substr(3, 1));
    var tetrad_letter = tetrad.substr(4, 1);
    var tetrad_letter_ord = ord(tetrad_letter);
    if (tetrad_letter_ord > 79) tetrad_letter_ord--; // Adjust for no O
    east = east * 10000 + Math.floor((tetrad_letter_ord - 65) / 5) * 2000 + 1000;
    north = north * 10000 + ((tetrad_letter_ord - 65) % 5) * 2000 + 1000;
    
    // Then convert the letters at the start to coordinates (code from jscoord)
    var char1 = tetrad.substring(0, 1);
    var char2 = tetrad.substring(1, 2);
    if (char1 == 'H') {
	north += 1000000;
    } else if (char1 == 'N') {
	north += 500000;
    } else if (char1 == 'O') {
	north += 500000;
	east  += 500000;
    } else if (char1 == 'T') {
	east += 500000;
    }
    var char2ord = ord(char2);
    if (char2ord > 73) char2ord--; // Adjust for no I
    var e = east + ((char2ord - 65) % 5) * 100000;
    var n = north + (4 - Math.floor((char2ord - 65) / 5)) * 100000;
    
    // Then create the map area (code from essex corn bunting survey website)
    var osMap = new OpenSpace.Map('map', { controls: [] });
    osMap.setCenter(new OpenSpace.MapPoint(e, n), 8);
    var vectorLayer = new OpenLayers.Layer.Vector("Vector Layer");
    osMap.addLayer(vectorLayer);
    var style_tetrad = {
	strokeColor: "#FF0000",
	strokeOpacity: 1,
	strokeWidth: 2,
	fillOpacity: 0 
    };
    var p1 = new OpenLayers.Geometry.Point(e-1000, n-1000);
    var p2 = new OpenLayers.Geometry.Point(e-1000, n+1000);
    var p3 = new OpenLayers.Geometry.Point(e+1000, n+1000);
    var p4 = new OpenLayers.Geometry.Point(e+1000, n-1000);
    var points = [];
    points.push(p1);
    points.push(p2);
    points.push(p3);
    points.push(p4);
    var linearRing = new OpenLayers.Geometry.LinearRing(points);
    var polygonFeature = new OpenLayers.Feature.Vector(linearRing, null, style_tetrad);
    vectorLayer.addFeatures([polygonFeature]); 
}

function ord(x) {
  var c = x.charAt(0);
  var i;
  for (i = 0; i < 256; ++ i) {
    var h = i.toString (16);
    if (h.length == 1)
      h = "0" + h;
    h = "%" + h;
    h = unescape (h);
    if (h == c)
      break;
  }
  return i;
}
