(async () =>{
    const tripProduction = await fetch(
        './data/trip_production_different_modes_s.json'
    ).then(response => response.json());
    
    const productionData = [];
    for (x in tripProduction){
        productionData.name = x;
        var datalist = [];
        for (y in tripProduction[x]){
            datalist.push({name: y, value: tripProduction[x][y]});
        }
        productionData.push({name:x, data:datalist})
    }



    Highcharts.chart('bubble', {
        chart: {
            type: 'packedbubble',
            height: 400,
            width: 910,
            backgroundColor: 'transparent',
            style: {
                fontFamily: 'Time new Roman'
            }
        },

        title: {
            text: 'Trip production from TAZs using different modes',
            style: {
                color: 'black',
                fontWeight: 'bold'
            }
        },
        tooltip: {
            useHTML: true,
            pointFormat: '<b>{point.name}:</b> {point.value}trips',
            style: {
                fontFamily: 'Time new Roman',
                color: "black"
            }
        },
        plotOptions: {
            packedbubble: {
                minSize: '30%',
                maxSize: '120%',
                zMin: 0,
                zMax: 1000,
                layoutAlgorithm: {
                    splitSeries: false,
                    gravitationalConstant: 0.02
                },
                dataLabels: {
                    enabled: true,
                    format: '{point.name}',
                    filter: {
                        property: 'y',
                        operator: '>',
                        value: 250
                    },
                    style: {
                        color: 'black',
                        textOutline: 'none',
                        fontWeight: 'normal'
                    }
                }
            }
        },
        series: productionData
    });
})();

