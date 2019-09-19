// @TODO: YOUR CODE HERE!
console.log("In javascript app.js")

// Define chart area

var svgWidth = 690;
var svgHeight = 500;

//Define margins 

var margin = {
    top: 20,
    right: 40,
    bottom: 100,
    left: 100
};

// chart area  minus margins.
var chartWidth  = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Create svg container and shift everything over by the margins 

var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    

var chartGroup = svg.append('g')
.attr('transform', `translate(${margin.left}, ${margin.top})`);

// Read data from data.csv
d3.csv("assets/data/data.csv")
.then(function(bsfssData){
    console.log()
    // Parse Data/Cast asnumbers
    bsfssData.forEach(function(data){
        data.poverty = +data.poverty;
        data.povertyMoe = +data.povertyMoe;
        data.age = + data.age;
        data.ageMoe = +data.ageMoe ;
        data.income = + data.income;
        data.incomeMoe = + data.incomeMoe;
        data.healthcare = +data.healthcare;
        data.obesity = + data.obesity;
        data.smokes= +data.smokes
    });

    // Create scale functions
    //Scale x to chart Width
    var xLinearScale = d3.scaleLinear()
    .domain([d3.min(bsfssData, d => d.poverty)-1, d3.max(bsfssData, d => d.poverty)])
    .range([0, chartWidth]);

    // Scale y to chart height
    var yLinearScale = d3.scaleLinear()
    .domain([d3.min(bsfssData, d => d.healthcare)-1, d3.max(bsfssData, d => d.healthcare)])
    .range([chartHeight, 0]);
    

    //Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append Axes to the chart

    chartGroup.append('g')
    .attr('tranform', `translate(0, ${chartHeight})`)
    .call(bottomAxis);

    chartGroup.append('g')
    .call(leftAxis);

// Create dots

var circlesGroup = chartGroup.selectAll('circle')
    .data(bsfssData)
    .enter()
    .append('circle')
    .attr('cx', d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr('r', '9')
    .attr('fill', "#7CE8D5")
    .attr("stroke", "black")
    .style("stroke-width", "1px")

var circlestext = chartGroup.selectAll("label")
    .data(bsfssData)
    .enter()
    .append("text")
    .text(d => d.abbr)
    .attr("font-size", 7)
    .attr("fill", "black")
    .attr("x", function (d){ return xLinearScale(d.poverty);})
    .attr("y", function(d){ return yLinearScale(d.healthcare);})
    .style("fill", "black")

//Initialize tool tip
    
var toolTip = d3.tip()
    .attr('class', 'tooltip')
    .offset([80, -60])
    .html(function(data){
        return(`${data.abbr}<br>IN Poverty: ${data.poverty}%<br>No Healthcare: ${data.healthcare}%`);
    });
// Create tooltip in the chart 
chartGroup.call(toolTip);

// Create event listeners to display and hide the tooltip
// Show on mouseover
circlestext.on('mouseover', function(data){
    toolTip.show(data, this);
    })
// Hide and show on mouseout
    .on('mouseout',function(data, index){
        toolTip.hide(data);
    });

// Creat axes labels

chartGroup.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 0 - margin.left + 40)
    .attr('x', 0 - (chartHeight / 2))
    .attr('dy', '1em')
    .attr('class', 'axisText')
    .text('Lacking Healthcare (%)');

// x-axis labels
chartGroup.append('text')
.attr(
        'transform', 'translate(' + chartWidth / 2 + ' ,' + (chartHeight + margin.top + 30) + ')',
    )
    .attr('class', 'axisText')
    .text('In Poverty (%)');
});