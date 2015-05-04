window.onload=function()
{ 

	var margin = { top:30, right:20, bottom:30, left:80}
	var width = 1000 - margin.left - margin.right 
	var height = 400 - margin.top 
	var heightDS = 150 -  margin.top - margin.bottom
	var color = d3.scale.category10()
					
	var x = d3.scale.linear().range([0,width])
	var y = d3.scale.linear().range([height,0])
	
	var yAxis = d3.svg.axis().scale(y)
		.orient("left").ticks(5);
	
	var yGrid = d3.svg.axis().scale(y)
		.orient(y)
		.orient("left")
		.ticks(5)
	
	var upSvg = d3.select("#psi")
				.append("svg")
				.attr("width",1000)
				.attr("height", 400)
				.append("g")
				.attr("transform", "translate(" + margin.left +","+ margin.top + ")" )
					
	var lineSvg = d3.select("#psi")
					.append("svg")
					.attr("width",1000)
					.attr("height",heightDS)
					.append("g")
					.attr("transform", "translate(" + margin.left + "," + 0 + ")")

	var modelSvg = d3.select("#psi")
					.append("svg")
					.attr("width", 1000)
					.attr("height",heightDS)
					.append("g")
					.attr("transform", "translate(" + margin.left + "," + 0+ ")")
					
	var descriptionSvg = d3.select("#psi")
					.append("svg")
					.attr("width", 1000)
					.attr("height",heightDS)
					.append("g")
					.attr("transform", "translate(" + margin.left + "," + 0 + ")")
	
	var tooltipDiv = d3.select("#psi")
						.append("div")
						.attr("class", "tooltip")
						.style("opacity",0)
	
	d3.csv("./psi_sample.csv?ran=" + Math.random(), function(error, data){
		data.forEach(function(d) {
				d.PSI = +d.PSI;
				d.begin = +d.begin; 
				d.endFragment = +d.endFragment; 
				d.endGap = +d.endGap; 
				d.PSI_end = +d.PSI_end; 
				d.beginPoint = +d.beginPoint; 
				d.endPoint = +d.endPoint; 
				d.start = +d.start; 
				d.width = +d.width; 
				alert(d.group)
		});
		
		x.domain([0, d3.max(data,function(d){ return d.endGap})])
		y.domain([0,1])
		
		
		var dataNest = d3.nest()
			.key(function(d){ return d.group})
			.entries(data)
	
		var yAxis = d3.svg.axis().scale(y)
			.orient("left").ticks(11)
			.tickValues([0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7,0.8,0.9,1.0])
		
		
		
		
		upSvg.selectAll(".guidRect")
			.data(dataNest[0].values)
			.enter().append("rect")
			.attr("class","guidRect")
			.attr("id", function(d){ return d.exon_ID})
			.attr("stroke", "black")
			.style("stroke-dasharray", ("5,10"))
			.attr("fill", "grey")
			.style("fill-opacity",0)
			.style("stroke-opacity",0)
			.attr("x", function(d){return x(d.begin)})
			.attr("y", 0)
			.attr("height",height)
			.attr("width", function(d){return x(d.endFragment - d.begin)})  
		
		dataNest.forEach(function(d){
			upSvg.selectAll("."+d["key"] + "_segment")
					.data(d["values"])
					.enter().append("line")
					.attr("class",d["key"])
					.attr("id",function(d) { return d.exon_ID})
					.attr("stroke", color(d["key"]))
					.attr("stroke-width",5)
					.attr("x1",function(d){return x(d.begin)})
					.attr("y1",function(d){return y(d.PSI)})
					.attr("x2",function(d){return x(d.endFragment)})
					.attr("y2",function(d){return y(d.PSI)})
					.on("mouseover",function(d){
						tooltipDiv.transition()
									.duration(200)
									.style("opacity",0.9)
						tooltipDiv.html(d.group + "<br/>" + d.PSI)
									.style("left", d3.event.pageX + "px")
									.style("top", d3.event.pageY - 28 + "px")
						
						var underMouse = this 
						modelSvg.selectAll(".model")
								.transition()
								.style("opacity", function(){
									return (this.id == underMouse.id)? 1:0.4
								})
								
						lineSvg.selectAll(".link")
								.transition()
								.style("opacity",0) 
								
						upSvg.selectAll(".guidRect")
								.transition() 
								.style("fill-opacity", function(){
									return (this.id == underMouse.id)?0.2:0
								})
								.style("stroke-opacity", function(){
									return (this.id == underMouse.id)?1:0
								})
								
						lineSvg.selectAll(".guidRect")
								.transition() 
								.style("fill-opacity", function(){
									return (this.id == underMouse.id)?0.2:0
								})
								.style("stroke-opacity", function(){
									return (this.id == underMouse.id)?1:0
								})
						})
						
					.on("mouseout", function(d){
						tooltipDiv.transition()
									.duration(500)
									.style("opacity",0)
			
						modelSvg.selectAll(".model")
								.transition()
								.style("opacity", 1) 
								
								
						lineSvg.selectAll(".link")
								.transition()
								.style("opacity", 1)
								
								
						upSvg.selectAll(".guidRect")
								.transition() 
								.style("fill-opacity", 0) 
								.style("stroke-opacity",0)
								
						lineSvg.selectAll(".guidRect")
								.transition() 
								.style("fill-opacity", 0) 
								.style("stroke-opacity",0)
					})
			
			
			
			upSvg.append("g")
				.attr("class", "yAxis")
				.attr("transform", "translate(" +  "-20"   +","+ 0 + ")" )
				.call(yAxis)
				

 			
			upSvg.selectAll("." + d["key"] + "_gap")
					.data(d["values"])
				    .enter().append("line")
					.attr("class",d["key"])
					.attr("stroke", color(d["key"]))
					.attr("x1",function(d){return x(d.endFragment)})
					.attr("x2", function(d){return x(d.endGap)})
					.attr("y1", function(d){return y(d.PSI)})
					.attr("y2", function(d){return y(d.PSI_end)})
					.style("stroke-dasharray", ("20,4"))
					.style("opacity", .2)  
					
					
/* 			upSvg.append("text")
					.attr("x", (legendSpace/2)+i*legendSpace)
					.attr("y", height + (margin.bottom/2)+ 5)
					.attr("class", "legend")
					.style("fill", function() {
							return d.color = color(d.key); })
					.text(d.key); */ 
			
		})
		
		
		lineSvg.selectAll(".guidRect")
				.data(dataNest[0].values)
			  .enter().append("polygon")
			   .attr("class","guidRect")
			   .attr("id", function(d){ return d.exon_ID})
			   .style("stroke-dasharray", ("5,10"))
			   .attr("fill", "grey")
			   .attr("stroke","black")
			   .attr("stroke-opacity",0)
			   .style("fill-opacity",0)
			   .attr("points", function(d){return x(d.begin)+","+0+" "+
												  x(d.start)+","+heightDS+" "+
												  x(d3.sum([d.start,d.width]))+","+heightDS+" "+
												  x(d.endFragment)+","+0 })

			 
			 
		lineSvg.selectAll(".link")
				.data(dataNest[0].values)
			  .enter().append("line")
			   .attr("class","link")
			   .attr("stroke", "grey")
			   .attr("id",function(d) { return d.exon_ID})
			   .attr("x1", function(d){return x(d.beginPoint)})
			   .attr("y1", heightDS)
			   .attr("x2", function(d){return x(d.endPoint)})
			   .attr("y2", 0)

		
		modelSvg.selectAll(".model")
				.data(dataNest[0].values)
			   .enter().append("rect")
				.attr("class", "model")
				.attr("id",function(d) { return d.exon_ID})
				.style("fill", "gray")
				.style("stroke","black")
				.attr("x", function(d){return x(d.start)})
				.attr("y", 0)
				.attr("height",heightDS)
				.attr("width", function(d){return x(d.width)})
				.attr("rx",3)
				.attr("ry",3)
				.on("mouseover",function(d){						
						var underMouse = this 
						modelSvg.selectAll(".model")
								.transition()
								.style("opacity", function(){
									return (this.id == underMouse.id)? 1:0.4
								})
								
						lineSvg.selectAll(".link")
								.transition()
								.style("opacity",0) 
								
						upSvg.selectAll(".guidRect")
								.transition() 
								.style("fill-opacity", function(){
									return (this.id == underMouse.id)?0.2:0
								})
								.style("stroke-opacity", function(){
									return (this.id == underMouse.id)?1:0
								})
								
						lineSvg.selectAll(".guidRect")
								.transition() 
								.style("fill-opacity", function(){
									return (this.id == underMouse.id)?0.2:0
								})
								.style("stroke-opacity", function(){
									return (this.id == underMouse.id)?1:0
								})	
						})
				.on("mouseout", function(d){
					tooltipDiv.transition()
								.duration(500)
								.style("opacity",0)
		
					modelSvg.selectAll(".model")
							.transition()
							.style("opacity", function(){
								return 1.0 
							})
							
							
					lineSvg.selectAll(".link")
							.transition()
							.style("opacity", 1)
							
							
					upSvg.selectAll(".guidRect")
							.transition() 
							.style("fill-opacity", 0) 
							.style("stroke-opacity",0)
							
					lineSvg.selectAll(".guidRect")
							.transition() 
							.style("fill-opacity", 0) 
							.style("stroke-opacity",0)
				})


					
		modelSvg.selectAll(".modelLink")
			  .data(dataNest[0].values)
			 .enter().append("line")
			  .attr("class","modelLink")
			  .attr("stroke","black")
			  .attr("x1", function(d){return x(d.start + d.width)})
			  .attr("y1", heightDS/2)
			  .attr("x2", function(d,i){
				return (i+1 == dataNest[0].values.length)? x(d.start + d.width):x(d.start + d.width + 100)
				})
			  .attr("y2", heightDS/2)
	})

}
