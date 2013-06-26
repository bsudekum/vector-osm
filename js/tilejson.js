/* Experimental vector tile layer for Leaflet
 * Uses D3 to render GeoJSON; faster than Leaflet's native.
 * Originally by Ziggy Jonsson: http://bl.ocks.org/ZJONSSON/5602552
 * Reworked by Nelson Minar: http://bl.ocks.org/NelsonMinar/5624141
 *
 * Todo:
 *   Make this work even if <svg> isn't in the DOM yet
 *   Make this work for tile types that aren't FeatureCollection
 *   Match D3 idioms for .classed(), .style(), etc
 *   Work on allowing feature popups, etc.
 */
L.TileLayer.d3_topoJSON =  L.TileLayer.extend({
    onAdd : function(map) {
        L.TileLayer.prototype.onAdd.call(this,map);
        this._path = d3.geo.path().projection(function(d) {
            var point = map.latLngToLayerPoint(new L.LatLng(d[1],d[0]));
            return [point.x,point.y];
        });
        this.on('tileunload',function(d) {
            if (d.tile.xhr) d.tile.xhr.abort();
            if (d.tile.nodes) d.tile.nodes.remove();
            d.tile.nodes = null;
            d.tile.xhr = null;
        });
    },
   _loadTile : function(tile,tilePoint) {
        var self = this;
        this._adjustTilePoint(tilePoint);

        if (!tile.nodes && !tile.xhr) {
            tile.xhr = d3.json(this.getTileUrl(tilePoint),function(error, tjData) {

                var pois = topojson.feature(tjData, tjData.objects.pois);
                var landUsages = topojson.feature(tjData, tjData.objects['land-usages']);
                var buildings = topojson.feature(tjData, tjData.objects.buildings);
                var road = topojson.feature(tjData, tjData.objects.highroad);
                var water = topojson.feature(tjData, tjData.objects['water-areas']);
                
                tile.nodes = d3.select(map._container).select('svg').append('g');
                tile.nodes.selectAll('path')

                    .data(water.features).enter()
                        .append('path')
                            .attr('d', self._path)
                            .attr('class','water')

                    //** 
                    //POIS are not cool right now
                    //**
                    // .data(pois.features).enter()
                    //     .append('path')
                    //         .attr('d', self._path)
                    //         .attr('class', self.options.class)
                    //         .attr('class',function(d){
                    //             console.log(d.properties.kind)
                    //         })

                    .data(road.features).enter()
                        .append('path')
                            .attr('d', self._path)
                            .attr('class',function(d){
                                return d.properties.kind
                            })

                    .data(landUsages.features).enter()
                        .append('path')
                            .attr('d', self._path)
                            .attr('class',function(d){
                                if(d.properties.area < 6496310){
                                    return d.properties.kind +' landuse'     
                                }else{
                                    return d.properties.kind +' landuse nodraw'     
                                }   
                            })

                    .data(buildings.features).enter()
                        .append('path')
                            .attr('d', self._path)
                            .attr('class','building')
                    
                    
            });
        }
    }
});


