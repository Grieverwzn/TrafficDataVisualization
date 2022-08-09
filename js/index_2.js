
(async () =>{

    const odDemand = await fetch(
        './data/od_demand_s.json'
    ).then(response => response.json());

    
    const demand_list = []; 
    var demand =odDemand
    for (i =0; i<demand.length; i++){
        demand_list.push([demand[i].origin_zone_name, demand[i].destination_zone_name, demand[i].annual_total_trips/1000000])
    }

    Highcharts.chart('Arc', {
        chart: {
            height: 410,
            width: 910,
            backgroundColor: 'transparent',
            style: {
                fontFamily: 'Time new Roman'
            }
        },

        colors: ['#293462', '#a64942', '#fe5f55', '#fff1c1', '#5bd1d7', '#ff502f', '#004d61', '#ff8a5c', '#fff591', '#f5587b', '#fad3cf', '#a696c8', '#5BE7C4', '#266A2E', '#593E1A'],

        title: {
            text: 'Annual total trips between Origin/Destination pairs (unit: million trips)',
            style: {
                color: 'black',
                fontWeight: 'bold'
            }
        },

        accessibility: {
            description: 'Arc diagram chart with circles of different sizes along the X axis, and connections drawn as arcs between them. From the chart we can see that Paris is the city with the most connections to other cities.',
            point: {
                valueDescriptionFormat: 'Connection from {point.from} to {point.to}.'
            }
        },

        series: [{
            keys: ['from', 'to', 'weight'],
            type: 'arcdiagram',
            name: 'Train connections',
            linkWeight: 1,
            centeredLinks: true,
            dataLabels: {
                rotation: 90,
                y: 30,
                align: 'left',
                color: 'black'
            },
            offset: '65%',
            data: demand_list
        }]

    });
})();
