(async () => {

    var mapData = await fetch(
        './data/california.geojson'
    ).then(response => response.json());
        

    const county_list =[]; 
    for (x in mapData.features){
        const temp_dict = {id: mapData.features[x].properties.NAME, 
            lat: parseFloat(mapData.features[x].properties.INTPTLAT), 
            lon: parseFloat(mapData.features[x].properties.INTPTLON)}
        county_list.push(temp_dict)
    }

    const odDemand = await fetch(
        './data/od_demand_nameCorrect.json'
    ).then(response => response.json());


    const origin_list = [];
    for (x in odDemand){
        if (!origin_list.includes(odDemand[x].origin_zone_name)){
            origin_list.push(odDemand[x].origin_zone_name);
        }  
    }

    const ozone_list =[]
    for (i = 0; i < origin_list.length; i ++){
        const destination_list = [];
        const demand_list = []
        for (x in odDemand){
            destination_list.push(odDemand[x].destination_zone_name)
            demand_list.push(odDemand[x].annual_total_trips/1000000)
        }
        ozone_list.push({origin: origin_list[i], destination:destination_list, demand: demand_list})

    }

    // Initialize the chart
    // Initialize the chart
    const chart = Highcharts.mapChart('OD', {
        title: {
            text: 'Trip distribution among different counties',
            style: {
                color: 'black',
                fontWeight: 'bold'
            }            
        },
        chart: {
            width: 800,
            height: 780,
            backgroundColor: 'transparent',
            style: {
                fontFamily: 'Time new Roman'
            }
        },

        legend: {
            align: 'center',
            layout: 'vertical',
            floating: false
        },

        accessibility: {
            point: {
                valueDescriptionFormat: '{xDescription}.'
            }
        },

        mapNavigation: {
            enabled: true
        },

        tooltip: {
            formatter: function () {
                return this.point.id + (
                    this.point.lat ?
                        '<br>Lat: ' + this.point.lat + ' Lon: ' + this.point.lon : ''
                );
            }
        },

        plotOptions: {
            series: {
                marker: {
                    fillColor: '#ABB2B9',
                    lineWidth: 1,
                    lineColor: Highcharts.getOptions().colors[1]
                },
                animation:{
                    duration:500
                }
            }
        },
        
        mapNavigation: {
            enabled: true
            // enableDoubleClickZoomTo: true
        },

        series: [{
            // Use the gb-all map with no data as a basemap
            mapData,
            name: 'California',
            borderColor: 'black',
            nullColor: 'rgba(200, 200, 200, 0.3)',
            showInLegend: false,
            borderWidth: 1.5,
            animation:true,
            states: {
                hover: {
                    color: '#a4edba'
                }
            },
            tooltip: {
                valueSuffix: '/km??'
            }
        }, {
            // Specify cities using lat/lon
            type: 'mappoint',
            name: 'Cities',
            dataLabels: {
                format: '{point.id}',
                enabled: true,
                align: 'left',
                x: 5,
                verticalAlign: 'middle'
            },
            // Use id instead of name to allow for referencing points later using
            // chart.get

            data: county_list
        }]
    });

    // Function to return an SVG path between two points, with an arc
    function pointsToPath(fromPoint, toPoint, invertArc) {
        const
            from = chart.mapView.lonLatToProjectedUnits(fromPoint),
            to = chart.mapView.lonLatToProjectedUnits(toPoint),
            curve = 0.01,
            arcPointX = (from.x + to.x) / (invertArc ? 2 + curve : 2 - curve),
            arcPointY = (from.y + to.y) / (invertArc ? 2 + curve : 2 - curve);
        return [
            ['M', from.x, from.y],
            ['Q', arcPointX, arcPointY, to.x, to.y]
        ];
    }

    // Add a series of lines for London
    for (x in ozone_list){
        const startPoint = chart.get(ozone_list[x].origin)
        const destinationData = []; 
        for (d in ozone_list[x].destination)
            destinationData.push({id: ozone_list[x].origin + ' --> ' +ozone_list[x].destination[d] + ' annual trips: ' + Math.round(ozone_list[x].demand[d]) + " million trips",
            path: pointsToPath(startPoint, chart.get(ozone_list[x].destination[d]))})

        chart.addSeries({
            name: ozone_list[x].origin +'  trips',
            type: 'mapline',
            lineWidth: 2,
            color: Highcharts.getOptions().colors[parseInt(Math.random()*9)],
            animation: true,
            allowPointSelect: true,
            marker: {
                enabled:true 
            },
            states: {
                hover: {
                    lineWidth: 3
                },
                select: {
                    lineWidth: 5,
                    color: 'red',  
                }
            },
            data: destinationData
        }, true, false)
    }



    // chart.addSeries({
    //     name: 'Los Angelos Trips',
    //     type: 'mapline',
    //     lineWidth: 2,
    //     color: Highcharts.getOptions().colors[3],
    //     animation: true,
    //     allowPointSelect: true,
    //     marker: {
    //         enabled:true 
    //     },
    //     states: {
    //         hover: {
    //             color: 'green'
    //         },
    //         select: {
    //             color: 'black',
    //             lineWidth: 5
    //         }
    //     },
    //     data: [{
    //         id: 'Los_Angelos - San_Fransico',
    //         path: pointsToPath(londonPoint, chart.get('San_Fransico'))
    //     }]
    // }, true, false);

    // // Add a series of lines for Lerwick
    // chart.addSeries({
    //     name: 'San_Fransico trips',
    //     type: 'mapline',
    //     lineWidth: 2,
    //     color: Highcharts.getOptions().colors[5],
    //     data: [{
    //         id: 'San_Fransico - San_jose',
    //         path: pointsToPath(lerwickPoint, chart.get('San_jose'))
    //     }]
    // }, true, false);
})();
