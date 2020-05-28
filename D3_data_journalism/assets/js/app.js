//Define SVG
var svgWidth = 1100;
var svgHeight = 500;

//Define Margin
var margin = {
  top: 40,
  right: 40,
  bottom: 100,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Import data
(async function(){
  var stateData = await d3.csv("assets/data/data.csv").catch(function(error) {
    console.log(error);
  });


    // Parse Data
    stateData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
    });

    // Create X and Y scales
    var xLinearScale = d3.scaleLinear()
      .domain([9, d3.max(stateData, d => d.poverty)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([4, d3.max(stateData, d => d.healthcare)])
      .range([height, 0]);

    // Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //Append Axes
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    //Create Circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(stateData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "12")
    .attr("fill", "navy")
    .attr("opacity", ".8");

    var circleLabels = chartGroup.selectAll(null).data(stateData).enter().append("text");

   circleLabels
    .attr("x", function(d) {
      return xLinearScale(d.poverty);
    })
    .attr("y", function(d) {
      return yLinearScale(d.healthcare);
    })
    .text(function(d) {
      return d.abbr;
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", "10px")
    .attr("text-anchor", "middle")
    .attr("fill", "white");
      // Create axes labels
      chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Poverty (%)");

      var toolTip = d3.select("body").append("div")
      .attr("class", "tooltip");
  
    //Add mouseover event
    circlesGroup.on("mouseover", function(d, i) {
      toolTip.style("display", "block");
      toolTip.html(`State:${stateData.state}`);
    })
    
      .on("mouseout", function() {
        toolTip.style("display", "none");
      });
})()
