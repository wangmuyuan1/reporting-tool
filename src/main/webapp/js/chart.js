$(function ()
{
    $.post( "/rest/query",
            { sql: "select time, sum(cnt), avg(tp50), avg(tp90), avg(tp99) from access_log where status = 'ALL' group by time"},
            function( data ) {

                var yAxisMetadata = [];
                yAxisMetadata.push({name: 'sum(cnt)', type: 'column', yIndex: 0});
                yAxisMetadata.push({name: 'avg(tp50)', type: 'spline', yIndex: 1});
                yAxisMetadata.push({name: 'avg(tp90)', type: 'spline', yIndex: 1});
                yAxisMetadata.push({name: 'avg(tp99)', type: 'spline', yIndex: 1});

                populateChart(data, 'time', yAxisMetadata);
            }, "json"
    );
});

function getxAxis(data, xAxisName)
{
    return [{
                categories: data.series[xAxisName],
                crosshair: true
            }];
}

function getyAxis(data, yAxisMetadata)
{
    var yAxis = [];
    yAxisMetadata.forEach(function (element, index, array)
    {
        yAxis.push({title: {
                        text: element.name,
                        style: {
                            color: Highcharts.getOptions().colors[index]
                        }
                    },
                    labels: {
                        style: {
                            color: Highcharts.getOptions().colors[index]
                        }
                    },
                    opposite: (index > 0)
        });
    });
    return yAxis;
}

function getSeries(data, yAxisMetadata)
{
    var series = [];
    yAxisMetadata.forEach(function (element, index, array)
    {
        series.push(
                {
                    name: element.name,
                    type: element.type,
                    yAxis: element.yIndex,
                    data: data.series[element.name]
                }
        );
    });
    return series;
}

function populateChart(data, xAxisName, yAxisMetadata)
{
    $('#container').highcharts({
        chart: {
            zoomType: 'xy'
        },
        title: {
            text: 'Access Log Chart'
        },
        subtitle: {
            text: 'Source: North America'
        },
        xAxis: getxAxis(data, xAxisName),
        yAxis: getyAxis(data, yAxisMetadata),
        tooltip: {
            shared: true
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            x: 80,
            verticalAlign: 'top',
            y: 55,
            floating: true,
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
        },
        series: getSeries(data, yAxisMetadata)
    });
}