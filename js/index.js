(async () => {

  const mapData = await fetch(
      'https://code.highcharts.com/mapdata/countries/us/us-all.topo.json'
  ).then(response => response.json());

  // Initialize the chart
  const chart = Highcharts.mapChart('container', {

      title: {
          text: 'OD distribution demo'
      },

      legend: {
          align: 'left',
          layout: 'vertical',
          floating: true
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
                  fillColor: '#FFFFFF',
                  lineWidth: 2,
                  lineColor: Highcharts.getOptions().colors[1]
              }
          }
      },

      series: [{
          // Use the gb-all map with no data as a basemap
          mapData,
          name: 'Great Britain',
          borderColor: '#707070',
          nullColor: 'rgba(200, 200, 200, 0.3)',
          showInLegend: false
      }, {
          // Specify cities using lat/lon
          type: 'mappoint',
          name: 'Cities',
          dataLabels: {
              format: '{point.id}'
          },
          // Use id instead of name to allow for referencing points later using
          // chart.get
          data: [{
              id: 'DC',
              lat: 38.9072,
              lon: -77.0369
          }, {
              id: 'Phoenix',
              lat: 33.4484,
              lon: -112.074
          }, {
              dataLabels: {
                  align: 'left',
                  x: 5,
                  verticalAlign: 'middle'
              }
          }]
      }]
  });

  // Function to return an SVG path between two points, with an arc
  function pointsToPath(fromPoint, toPoint, invertArc) {
      const
          from = chart.mapView.lonLatToProjectedUnits(fromPoint),
          to = chart.mapView.lonLatToProjectedUnits(toPoint),
          curve = 0.05,
          arcPointX = (from.x + to.x) / (invertArc ? 2 + curve : 2 - curve),
          arcPointY = (from.y + to.y) / (invertArc ? 2 + curve : 2 - curve);
      return [
          ['M', from.x, from.y],
          ['Q', arcPointX, arcPointY, to.x, to.y]
      ];
  }

  const londonPoint = chart.get('DC'),
      lerwickPoint = chart.get('Phonix');

  // Add a series of lines for London
  chart.addSeries({
      name: 'London flight routes',
      type: 'mapline',
      lineWidth: 2,
      color: Highcharts.getOptions().colors[3],
      data: [{
          id: 'DC - Phoenix',
          path: pointsToPath(londonPoint, chart.get('Phoenix'))
      }]
  }, true, false);

})();
