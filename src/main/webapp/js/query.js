/**
 * Created by mwang on 30/10/2015.
 * This file represent for query object.
 */
var queryBlockNumber = 1;

$.QueryBlock = function (id) {
    this.id = id;
    this.sqlResult = {};
    this.totalAvailSeries = 0;
    this.currentNumberOfSeries = 2;
    this.init();
};

$.QueryBlock.prototype = {
    init: function()
    {
        var qbId = this.id ;
        var that = this;

        this.createContent();
        $('#' + qbId + 'QuerySubmit').click(function()
        {
            that.handleQuerySubmit();
        });
        $('#' + qbId + 'ChartSubmit').click(function()
        {
            that.handleChartSubmit()
        });
        $('#' + qbId + 'AddSeries').click(function()
        {
            that.handleAddSeries();
        });
    },

    createContent: function()
    {
        var qbId = this.id;
        $('#mainPanel').append('<div id="' + qbId + 'QueryBlock">' +
                '<div class="queryEditor">' +
                    '<div>' +
                        '<textarea id="' + qbId + 'Sql" class="sqlTextArea"></textarea>' +
                        '<button id="' + qbId + 'QuerySubmit" class="querySubmit">SUBMIT</button>' +
                    '</div>' +
                    '<div class="chartOptions">' +
                        '<select id="' + qbId + 'ChartType">'+
                            '<option value="xy">X-Y Chart</option>'+
                        '</select>'+
                        '<div id="' + qbId + 'ChartOption">'+
                        '</div>'+
                        '<button id="' + qbId + 'AddSeries" class="addSeries">Add Series</button>'+
                        '<button id="' + qbId + 'ChartSubmit" class="chartSubmit">Build Chart</button>'+
                    '</div>' +
                '</div>' +
                '<div id="' + qbId + 'Container" class="chartContainer"></div>'+
            '</div>');
    },

    handleQuerySubmit: function()
    {
        var qbId = this.id;
        var that = this;
        $.post( "/rest/query",
                { sql: $('#' + qbId + 'Sql').val()},
                function( data ) {
                    that.setQueryResult(data);
                    that.populateChartOptions(data);
                }, "json"
        );
    },

    handleChartSubmit: function()
    {
        var qbId = this.id;
        var yAxisMetadata = [];

        $('[id^=' + qbId + 'AxisType]').each(function()
            {
                if ($(this).val() == 'yAxis')
                {
                    var i = $(this).attr('id').substr(-1);
                    yAxisMetadata.push({name: $('#' + qbId + 'AxisSeries' + i).val(), type: $('#' + qbId + 'AxisYAxisType' + i).val(), yIndex: parseInt($('#' + qbId + 'YAxisIndex' + i).val())});
                }
            }
        );

        this.populateChart(this.sqlResult, $('#' + qbId+ 'AxisSeries0').val(), yAxisMetadata);
    },

    handleAddSeries: function()
    {
        this.currentNumberOfSeries++;
        this.populateChartOptions(this.sqlResult);
    },

    addChartOption: function(index)
    {
        var qbId = this.id;
        $('#' + qbId + 'ChartOption').append(
                '<div>' +
                '<select id="' + qbId + 'AxisSeries' + index + '"></select>' +
                '<select id="' + qbId + 'AxisType' + index + '"><option value="xAxis">xAxis</option><option value="yAxis">yAxis</option></select>' +
                '<select id="' + qbId + 'AxisYAxisType' + index + '">' +
                    '<option value="column">column</option>' +
                    '<option value="spline">spline</option>' +
                '</select>' +
                '<select id="' + qbId + 'YAxisIndex' + index + '"></select>' +
              '</div>');
    },

    populateChartOptions: function(data)
    {
        var qbId = this.id;
        $('#' + qbId + 'ChartOption').html('');
        var options = '';
        var yIndexOption = '';
        this.totalAvailSeries = 0;
        var that = this;

        var i = 0;
        $.each(data.series, function(name, value){
            if (i < that.getCurrentNumberOfSeries())
            {
                that.addChartOption(i);
                i++;
            }
            options += '<option value="' + name + '">' + name + '</option>';
            that.setTotalAvailSeries(that.getTotalAvailSeries() + 1);
        });

        var k;
        for (k = 0; k < i - 1; k++)
        {
            yIndexOption += '<option value="' + k + '">' + k + '</option>'
        }

        $('[id^=' + qbId + 'AxisSeries]').each(function()
        {
            $(this).append(options);
        });
        $('[id^=' + qbId + 'YAxisIndex]').each(function()
        {
            $(this).append(yIndexOption);
        });

        for (k = 1; k < this.currentNumberOfSeries; k++)
        {
            $('#' + qbId + 'AxisSeries' + k).find('option:eq('+ k + ')').prop('selected', true);
            $('#' + qbId + 'AxisType' + k).find('option:eq(1)').prop('selected', true);
        }
    },

    getxAxis: function(data, xAxisName)
    {
        return [{
            categories: data.series[xAxisName],
            crosshair: true
        }];
    },

    getyAxis: function(data, yAxisMetadata)
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
    },

    getSeries: function(data, yAxisMetadata)
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
    },

    populateChart: function(data, xAxisName, yAxisMetadata)
    {
        var qbId = this.id;
        $('#' + qbId + 'Container').highcharts({
            chart: {
                zoomType: 'xy'
            },
            title: {
                text: 'Access Log Chart'
            },
            subtitle: {
                text: 'Source: North America'
            },
            xAxis: this.getxAxis(data, xAxisName),
            yAxis: this.getyAxis(data, yAxisMetadata),
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
            series: this.getSeries(data, yAxisMetadata)
        });
    },

    setQueryResult: function(data)
    {
        this.sqlResult = data;
    },

    getQueryResult: function()
    {
        return this.sqlResult;
    },

    setTotalAvailSeries: function(value)
    {
        this.totalAvailSeries = value;
    },

    getTotalAvailSeries: function()
    {
        return this.totalAvailSeries;
    },

    setCurrentNumberOfSeries: function(value)
    {
        this.currentNumberOfSeries = value;
    },

    getCurrentNumberOfSeries: function()
    {
        return this.currentNumberOfSeries;
    }
};

$(function ()
{
    $('#addQueryBlock').click(function() {
        new $.QueryBlock('QueryBlock' + (queryBlockNumber++));
    });
});