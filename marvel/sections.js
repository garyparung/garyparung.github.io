let data_aggregated, data_marvelpop, data_network, data_appearance, data_twitter, data_revenue, data_screen_time, data_screen_time_v01, data_frequency, data_first_appearance
let x_screen_time, y_screen_time, x_avg_screen_time, y_avg_screen_time, x_budget_revenue, y_budget_revenue
let followerSizeScale, followerXScale, categoryColorScale
let simulation, nodes_bubbles, nodes_network
let categoryLegend, salaryLegend

const margin = {left: 170, top: 50, bottom: 50, right: 20}
const width = 1000 - margin.left - margin.right
const height = 850 - margin.top - margin.bottom

const img_path = {
    "Iron Man":	"img/iron_man.jpg" ,
    "Nick Fury":	"img/nick_fury.jpg",
    "Hulk":"img/hulk.jpg",
    "Pepper Potts":	"img/pepper_potts.jpg",
    "War Machine":	"img/war_machine.jpg",
    "Agent Coulson":	"img/agent_coulson.jpg",
    "Betty Ross":	"img/betty_ross.jpg",
    "Emil Blonsky":	"img/emil_blonsky.jpg",
    "Iron Monger":	"img/iron_monger.jpg",
    "Black Widow":	"img/black_widow.jpg",
    "Ivan Vanko":	"img/ivan_vanko.jpg",
    "Captain America":	"img/captain_america.jpg",
    "Thor Odinson":	"img/thor.jpg",
    "Hawkeye":	"img/hawkeye.jpg",
    "Heimdall":	"img/heimdall.jpg",
    "Loki":	"img/loki.jpg",
    "Winter Soldier":	"img/winter_soldier.jpg",
    "Jane Foster":	"img/jane_foster.jpg",
    "Odin":	"img/odin.jpg",
    "Peggy Carter":	"img/peggy_carter.jpg",
    "Red Skull":	"img/red_skull.jpg",
    "Thanos": "img/thanos.jpg",
    "Falcon":	"img/falcon.jpg",
    "Scarlet Witch":	"img/scarlet_witch.jpg",
    "Drax":	"img/drax.jpg",
    "Gamora":	"img/gamora.jpg",
    "Groot":	"img/groot.jpg",
    "Nebula":	"img/nebula.jpg",
    "Star-Lord":	"img/star_lord.jpg",
    "Rocket Raccoon":	"img/rocket.jpg",
    "Quicksilver":	"img/quicksilver.jpg",
    "Sharon Carter":	"img/sharon_carter.jpg",
    "Ant-Man":	"img/ant_man.jpg",
    "Vision":	"img/vision.jpg",
    "Hank Pym":	"img/hank_pym.jpg",
    "Wasp":	"img/wasp.jpg",
    "Spider-Man":	"img/spider_man.jpg",
    "Black Panther":	"img/black_panther.jpg",
    "Doctor Strange":	"img/doctor_strange.jpg",
    "Wong":	"img/wong.jpg",
    "The Ancient One":	"img/ancient_one.jpg",
    "Mantis":	"img/mantis.jpg",
    "Valkyrie":	"img/valkyrie.jpg",
    "Hela":	"img/hela.jpg",
    "Vulture":	"img/vulture.jpg",
    "Captain Marvel":	"img/captain_marvel.jpg",
    "MBaku"	:"img/mbaku.jpg",
    "Okoye"	:"img/okoye.jpg",
    "Shuri"	:"img/shuri.jpg",
    "Erik Killmonger":	"img/erik_killmonger.jpg",
    "Nakia"	:"img/nakia.jpg",
};

// Read all data

d3.csv('data/mcu_network.csv', function(data){
    return {
        hero_1: data.hero1,
        hero_2: data.hero2,
        conns: data.conns
    };
}).then(data => {
    data_network = data
    console.log(data_network)
})

d3.csv('data/aggregated_new.csv', function(data){
    return {
        hero: data.hero,
        gross: +data.revenue_by_screentime_rounded_MM,
        budget: +data.budget_by_screentime_rounded_MM,
        img: +data.img_path,
        col_high: data.col_high
    };
}).then(data => {
    data_aggregated = data
    console.log(data_aggregated)
    color = d3.scaleOrdinal().domain(["high", "mid", "low"]).range([ "#357e57", "#89cff0", "#d1d1d1"]);
    x_budget_revenue = d3.scaleLinear().domain([0, 600]).range([ 0, width - 200]);
    y_budget_revenue = d3.scaleLinear().domain([3000, 0]).range([ 0, height- 130]);
    drawScatter()
})

d3.csv("data/marvelpop.csv", function(d){
    return {
        Character: d.Character,
        Year: d.Year,
        Appearance: +d.Appearance,
        Series: +d.Series
    };
}).then(data => {
    data_marvelpop = data
    console.log(data_marvelpop)
})

d3.csv('data/twitter.csv', function(data){
    return {
        character: data.character,
        alter_ego: data.alter_ego,
        actor: data.actor,
        first_appearance_month: data.first_appearance_month,
        first_appearance_year: data.first_appearance_year,
        first_appearance_movie: data.first_appearance_movie,
        twitter_handle: data.twitter_handle,
        followers: data.followers,
    };
}).then(data => {
    data_twitter = data
    followerSizeScale = d3.scaleLinear(d3.extent(data_twitter, d => d.followers / 100 + 10), [5,35])
    followerXScale = d3.scaleLinear(d3.extent(data_twitter, d => d.followers / 100 + 10), [margin.left, margin.left + width+250])
    console.log(data_twitter)
})

d3.csv('data/appearance.csv', function(data){
    return {
        character: data.Character,
        movies: data.Movies,
        year: data.Year
    };
}).then(data => {
    data_appearance = data
    console.log(data_appearance)
})

d3.csv('data/firstappearance.csv', function(d){    
    return {
        id: d.id,
        radius: d.total * 8,
        value: +d.total,
        name: d.name,
        movie: d.firstmovie,
        movies: d.movies,
        year: +d.year,
        img_path: d.img_path,
        series: d.series,
        x: Math.random() * 900,
        y: Math.random() * 800
    };
}).then(data => {
    data_first_appearance = data
    console.log(data_first_appearance)
    drawIntro()
})

d3.csv('data/frequency.csv', function(data){
    return {
        character: data.character,
        freq: data.freq
    };
}).then(data => {
    data_frequency = data
})

d3.csv('data/screen_time.csv', function(data){
    return {
        hero: data.hero,
        screen_time: data.cc_avg_time_avengers,
        img_path: data.img_path
    };
}).then(data => {
    data_screen_time = data
    x_avg_screen_time = d3.scaleLinear().domain([0, 1750]).range([ 0, width - 250]);
    y_avg_screen_time = d3.scaleBand().range([ 0, height - 130]).domain(data.map(function(d) { return d.hero; })).padding(1);
    console.log(data_screen_time)
})

d3.csv('data/screen_time_v01.csv', function(data){
    return {
        hero: data.hero,
        total_screen_time: data.total_screen_time,
        movies: data.movies,
        img_path: data.img_path
    };
}).then(data => {
    data_screen_time_v01 = data
    x_screen_time = d3.scaleLinear().domain([0, 25000]).range([ 0, width - 250]);
    y_screen_time = d3.scaleBand().range([ 0, height - 130]).domain(data.map(function(d) { return d.hero; })).padding(1);
    console.log(data_screen_time_v01)
})

function drawScatter(){
    d3.select("#vis").select('svg').remove().remove().transition()
    .duration(1500)
    .ease(d3.easeCubicInOut);

    let svg = d3.select("#vis")
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (height - 130) + ")")
        .call(d3.axisBottom(x_budget_revenue)
                .ticks(6))
        .selectAll("text")
          .attr("transform", "translate(-20,0)rotate(-30)")
          .style("text-anchor", "end");
    
    svg.append("text")             
        .attr("transform",
            "translate(" + ((width-250)/2) + " ," + 
                        (height - 90) + ")")
        .style("text-anchor", "middle")
        .text("Budget allocation ($mn)");

    svg.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y_budget_revenue)
        .tickSize(7));

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - 70)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Revenue allocation ($mn)"); 
        
    svg.append('g')
        .selectAll("dot")
        .data(data_aggregated)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x_budget_revenue(d.budget); } )
        .attr("cy", function (d) { return y_budget_revenue(d.gross); } )
        .attr("r", 7.5)
        .style("fill", function (d) { return color(d.col_high); } )
        .on('mouseover', mouseOver)
        .on('mouseout', mouseOut)
        .transition().duration(300).delay((d, i) => i * 5);

    function mouseOver(d, i){

        d3.select(this)
            .transition('mouseover').duration(100)
            .attr('opacity', 1)
            .attr('stroke-width', 5)
            .attr('stroke', 'black');
            
        d3.select('#tooltip')
            .style('left', (d3.event.pageX + 10)+ 'px')
            .style('top', (d3.event.pageY - 25) + 'px')
            .style('display', 'inline-block')
            .attr('opacity', 1)
            .html(`<strong>Character:</strong> ${d.hero} 
                <br> <strong>Budget allocation ($mn):</strong> ${numberWithCommas(d.budget)}
                <br> <strong>Revenue allocation ($mn):</strong> ${numberWithCommas(d.gross)}`);
    }

    function mouseOut(d, i){
        d3.select('#tooltip')
            .style('display', 'none');

        d3.select(this)
            .transition('mouseout').duration(100)
            .attr('opacity', 1)
            .attr('stroke-width', 0);
    }
}

function drawBubbles(){
    d3.select("#vis").select('svg').remove().transition()
    .duration(1500)
    .ease(d3.easeCubicInOut);

    let svg = d3.select("#vis")
        .append('svg')
        .attr('width', 1000)
        .attr('height', 950)
        .attr('opacity', 1)

    simulation = d3.forceSimulation(data_twitter)

    // Define each tick of simulation
    simulation.on('tick', () => {
        nodes_bubbles
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
    })

    var defs = svg.append("defs");
    defs.selectAll(".artist-pattern")
        .data(data_twitter)
        .enter().append("pattern")
        .attr("class", "artist-pattern")
        .attr("id", function(d){
            return d.character.toLowerCase().replace(/ /g, "-")
        })
        .attr("height", "100%")
        .attr("width", "100%")
        .attr("patternContentUnits","objectBoundingBox")
        .append("image")
        .attr("height", 1)
        .attr("width", 1)
        .attr("preserveAspectRatio", "none")
        .attr("xmlns:xlink", "http://w3.org/1999/xlink")
        .attr("xlink:href", function(d) { return img_path[d.character] })
    
    // Selection of all the circles 
    nodes_bubbles = svg
        .selectAll('circle')
        .data(data_twitter)
        .enter()
        .append('circle')
            .attr('cx', (d, i) => followerXScale(d.followers / 100 + 10) + 5)
            .attr('cy', (d, i) => i * 5.2 + 30);

    // Add mouseover and mouseout events for all circles
    // Changes opacity and adds border
    svg.selectAll('circle')
        .on('mouseover', mouseOver)
        .on('mouseout', mouseOut)
        .transition().duration(300).delay((d, i) => i * 5)
        .attr('r', (d, i) => d.followers / 30 + 10)
        .attr('fill', hasTwitter)
        .attr('opacity', 0.8)

    function mouseOver(d, i){
        d3.select(this)
            .transition('mouseover').duration(100)
            .attr('opacity', 1)
            .attr('stroke-width', 5)
            .attr('stroke', 'black')
            
        d3.select('#tooltip')
            .style('left', (d3.event.pageX + 10)+ 'px')
            .style('top', (d3.event.pageY - 25) + 'px')
            .style('display', 'inline-block')
            .attr('opacity', 1)
            .html(`<strong>Character:</strong> ${d.character} 
                <br> <strong>Twitter Followers:</strong> ${thousands_separators(d.followers)}`)
    }
    
    function thousands_separators(num) {
        var num_parts = num.toString().split(".");
        num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return num_parts.join(".") + 'k';
    }

    function mouseOut(d, i){
        d3.select('#tooltip')
            .style('display', 'none')
            .attr("opacity", 0)

        d3.select(this)
            .transition('mouseout').duration(100)
            .attr('opacity', 0.8)
            .attr('stroke-width', 0)
    }

    simulation.stop()

    simulation  
        .force('charge', d3.forceManyBody().strength([0.5]))
        .force('forceX', d3.forceX(400))
        .force('forceY', d3.forceY(350))
        .force('collide', d3.forceCollide(d => followerSizeScale(d.followers/30) + 20))
        .alphaDecay([0.02])

    //Reheat simulation and restart
    simulation.alpha(0.9).restart()
}

function drawNetwork(){
    d3.select("#vis").select('svg').remove();
    console.log('proper')

    let svg = d3.select("#vis")
        .append('svg')
        .attr('width', 950)
        .attr('height', 800)
        .attr('opacity', 1)
    
    let hero_1 = [];
    let hero_2 = [];
    let links_data = [];
    for (var i = 0; row = data_network[i]; i++) {
        hero_1.push(row.hero_1);
        hero_2.push(row.hero_2);
        links_data.push({
            source: row.hero_1,
            target: row.hero_2
        });
    }

    full_heroes = [...hero_1, ...hero_2]
    let unique_heroes = [...new Set(full_heroes)];
    let nodes_data = [];
    for (var i = 0; row = unique_heroes[i]; i++) {
        nodes_data.push({
            index: row,
            name: row,
            conns: 0
        });
    }

    for (var i = 0; link = data_network[i]; i++) {
        for (var j = 0; node = nodes_data[j]; j++) {
            if ((link.hero_1 === node.name) || ((link.hero_2) === (node.name))) {
                node.conns = node.conns + 1;
            }
        }
    }

    simulation = d3.forceSimulation(nodes_data)
        .force("charge", d3.forceManyBody().strength(-1))
        .force("center", d3.forceCenter(width / 2, height / 2 + 10))
        .force("link", d3.forceLink(links_data).id(d => d.name));

    // Define each tick of simulation
    simulation.on('tick', () => {
        nodes_network
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
    }).on("end", ticked)

    links = svg.append("g")
        .selectAll("line")
        .data(links_data)
        .enter()
        .append('line')
        .attr('opacity', 0.8)
        .attr('stroke-width', 1)
        .attr('stroke', 'black');
    
    var tooltipNetwork =  d3.select('#tooltip')
        .attr("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("color", "black")

    // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
    var showTooltipNetwork = function(d, i) {
        tooltipNetwork
            .transition()
            .duration(200)

        tooltipNetwork
            .attr("opacity", 1)
            .html("Character: " + d.name + "<br />" + "Total connections: " + d.conns)
            .style("left", (d3.event.pageX+10) + "px")
            .style("top", (d3.event.pageY-25) + "px")
            .style('display', 'inline-block')

        d3.select(this)
            .transition('mouseover').duration(100)
            .attr("r", d => d.conns + 5)
            .attr('stroke-width', 5)
            .attr('stroke', 'black')
    }

    var moveTooltipNetwork = function(d, i) {
        tooltipNetwork
            .style("left", (d3.event.pageX+10) + "px")
            .style("top", (d3.event.pageY-25) + "px")
    }

    var hideTooltipNetwork = function(d, i) {
        tooltipNetwork
            .transition()
            .duration(200)
            .attr("opacity", 0)
            .style('display', 'none')

        d3.select(this)
            .transition('mouseover').duration(100)
            .attr("r", d => d.conns + 5)
            .attr('stroke-width', 0)
    }

    var defs = svg.append("defs");
    defs.selectAll(".artist-pattern")
        .data(nodes_data)
        .enter().append("pattern")
        .attr("class", "artist-pattern")
        .attr("id", function(d){
            return d.name.toLowerCase().replace(/ /g, "-")
        })
        .attr("height", "100%")
        .attr("width", "100%")
        .attr("patternContentUnits","objectBoundingBox")
        .append("image")
        .attr("height", 1)
        .attr("width", 1)
        .attr("preserveAspectRatio", "none")
        .attr("xmlns:xlink", "http://w3.org/1999/xlink")
        .attr("xlink:href", function(d) { return img_path[d.name] })

    nodes_network = svg.append("g")
        .selectAll("circle")
        .data(nodes_data)
        .enter()
        .append("circle")
        .attr("r", d => d.conns + 5)
        .style("fill", function(d) {
            return "url(#" + d.name.toLowerCase().replace(/ /g, "-") + ")" 
        })
        .on("mouseover", showTooltipNetwork)
        .on("mousemove", moveTooltipNetwork)
        .on("mouseout", hideTooltipNetwork);

    svg.selectAll('circle')
        .transition().duration(300).delay((d, i) => i * 5)
        .attr('opacity', 0.8);
    
    simulation  
        .force('forceX', d3.forceX(300))
        .force('forceY', d3.forceY(200))
        .force('collide', d3.forceCollide(50))
        .alphaDecay([0.02])

    //Reheat simulation and restart
    simulation.alpha(0.9).restart()
}

function drawLollipop(){
    d3.select("#vis").select('svg').remove();
    
    let svg = d3.select("#vis")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    var defs = svg.append("defs");

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (height - 130) + ")")
        .call(d3.axisBottom(x_screen_time)
                .ticks(5))
        .selectAll("text")
          .attr("transform", "translate(-10,0)rotate(-45)")
          .style("text-anchor", "end");

    svg.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y_screen_time)
        .tickSize(0))

    svg.append("text")             
        .attr("transform",
            "translate(" + ((width-250)/2) + " ," + 
                        (height - 80) + ")")
        .style("text-anchor", "middle")
        .text("Screen time in seconds");

    // -1- Create a tooltip div that is hidden by default:  
    var tooltip =  d3.select('#tooltip')
        .attr("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("color", "black")

    // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
    var showTooltip = function(d, i) {
        tooltip
            .transition()
            .duration(200)
        tooltip
            .attr("opacity", 1)
            .html("Total screen time: " + d.total_screen_time + " seconds" + "<br />" + "Total movies: " + d.movies)
            .style("left", (d3.event.pageX+10) + "px")
            .style("top", (d3.event.pageY-25) + "px")
            .style('display', 'inline-block')

        d3.select(this)
            .transition('mouseover').duration(100)
            .attr('r', 60)
            .attr('stroke-width', 5)
            .attr('stroke', 'black')
    }

    var moveTooltip = function(d, i) {
        tooltip
            .style("left", (d3.event.pageX+10) + "px")
            .style("top", (d3.event.pageY-25) + "px")
    }

    var hideTooltip = function(d, i) {
        tooltip
            .transition()
            .duration(200)
            .attr("opacity", 0)
            .style('display', 'none')

        d3.select(this)
            .transition('mouseover').duration(100)
            .attr('r', 30)
            .attr('stroke-width', 0)
    }

    var defs = svg.append("defs");
    defs.selectAll(".artist-pattern")
        .data(data_screen_time_v01)
        .enter().append("pattern")
        .attr("class", "artist-pattern")
        .attr("id", function(d){
            return d.hero.toLowerCase().replace(/ /g, "-")
        })
        .attr("height", "100%")
        .attr("width", "100%")
        .attr("patternContentUnits","objectBoundingBox")
        .append("image")
        .attr("height", 1)
        .attr("width", 1)
        .attr("preserveAspectRatio", "none")
        .attr("xmlns:xlink", "http://w3.org/1999/xlink")
        .attr("xlink:href", function(d) { return d.img_path })

    // Lines
    svg.selectAll("myline")
        .data(data_screen_time_v01)
        .enter()
        .append("line")
        .attr("x1", x_screen_time(0))
        .attr("x2", x_screen_time(0))
        .attr("y1", function(d) { return y_screen_time(d.hero); })
        .attr("y2", function(d) { return y_screen_time(d.hero); })
        .attr("stroke", "grey") 

    // Circles -> start at X=0
    svg.selectAll("mycircle")
        .data(data_screen_time_v01)
        .enter()
        .append("circle")
        .attr("class", "circle")
        .attr("cx", x_screen_time(0) )
        .attr("cy", function(d) { return y_screen_time(d.hero); })
        .attr("r", "30")
        .style("fill", function(d) {
            return "url(#" + d.hero.toLowerCase().replace(/ /g, "-") + ")" 
        })
        .attr("stroke", "black")
        .on("mouseover", showTooltip)
        .on("mousemove", moveTooltip)
        .on("mouseout", hideTooltip)

    // Change the X coordinates of line and circle
    svg.selectAll("circle")
        .transition()
        .duration(1500)
        .ease(d3.easeCubicInOut)
        .attr("cx", function(d) { return x_screen_time(d.total_screen_time); })

    svg.selectAll("line")
        .transition()
        .duration(1500)
        .ease(d3.easeCubicInOut)
        .attr("x1", function(d) { return x_screen_time(d.total_screen_time); })
}

function drawLollipopAvgScreenTime(){
    d3.select("#vis").select('svg').remove();
    
    let svg = d3.select("#vis")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    var defs = svg.append("defs");

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (height - 130)+ ")")
        .call(d3.axisBottom(x_avg_screen_time)
                .ticks(5))
        .selectAll("text")
          .attr("transform", "translate(-10,0)rotate(-45)")
          .style("text-anchor", "end");

    svg.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y_avg_screen_time)
        .tickSize(0))

    svg.append("text")             
        .attr("transform",
            "translate(" + ((width-250)/2) + " ," + 
                        (height - 80) + ")")
        .style("text-anchor", "middle")
        .text("Average screen time per Avengers movies in seconds");

    // -1- Create a tooltip div that is hidden by default:  
    var tooltip =  d3.select('#tooltip')
        .attr("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("color", "black")

    // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
    var showTooltip = function(d, i) {
        tooltip
            .transition()
            .duration(200)
        tooltip
            .attr("opacity", 1)
            .html("Total screen time: " + d.screen_time + " seconds" + "<br />" + "Total movies: ")
            .style("left", (d3.event.pageX+10) + "px")
            .style("top", (d3.event.pageY-25) + "px")
            .style('display', 'inline-block')

        d3.select(this)
            .transition('mouseover').duration(100)
            .attr('r', 60)
            .attr('stroke-width', 5)
            .attr('stroke', 'black')
    }

    var moveTooltip = function(d, i) {
        tooltip
            .style("left", (d3.event.pageX+10) + "px")
            .style("top", (d3.event.pageY-25) + "px")
    }

    var hideTooltip = function(d, i) {
        tooltip
            .transition()
            .duration(200)
            .attr("opacity", 0)
            .style('display', 'none')

        d3.select(this)
            .transition('mouseover').duration(100)
            .attr('r', 30)
            .attr('stroke-width', 0)
    }

    defs.selectAll(".artist-pattern")
        .data(data_screen_time)
        .enter().append("pattern")
        .attr("class", "artist-pattern")
        .attr("id", function(d){
            return d.hero.toLowerCase().replace(/ /g, "-")
        })
        .attr("height", "100%")
        .attr("width", "100%")
        .attr("patternContentUnits","objectBoundingBox")
        .append("image")
        .attr("height", 1)
        .attr("width", 1)
        .attr("preserveAspectRatio", "none")
        .attr("xmlns:xlink", "http://w3.org/1999/xlink")
        .attr("xlink:href", function(d) { return d.img_path })

    // Lines
    svg.selectAll("myline")
        .data(data_screen_time)
        .enter()
        .append("line")
        .attr("x1", x_avg_screen_time(0))
        .attr("x2", x_avg_screen_time(0))
        .attr("y1", function(d) { return y_avg_screen_time(d.hero); })
        .attr("y2", function(d) { return y_avg_screen_time(d.hero); })
        .attr("stroke", "grey") 

    // Circles -> start at X=0
    svg.selectAll("mycircle")
        .data(data_screen_time)
        .enter()
        .append("circle")
        .attr("class", "circle")
        .attr("cx", x_avg_screen_time(0) )
        .attr("cy", function(d) { return y_avg_screen_time(d.hero); })
        .attr("r", "30")
        .style("fill", function(d) {
            return "url(#" + d.hero.toLowerCase().replace(/ /g, "-") + ")" 
        })
        .attr("stroke", "black")
        .on("mouseover", showTooltip)
        .on("mousemove", moveTooltip)
        .on("mouseout", hideTooltip)

    // Change the X coordinates of line and circle
    svg.selectAll("circle")
        .transition()
        .duration(1500)
        .ease(d3.easeCubicInOut)
        .attr("cx", function(d) { return x_avg_screen_time(d.screen_time); })

    svg.selectAll("line")
        .transition()
        .duration(1500)
        .ease(d3.easeCubicInOut)
        .attr("x1", function(d) { return x_avg_screen_time(d.screen_time); })
}

function drawEnding(){
    d3.select("#vis").select('svg').remove(); 
}

function drawBar() {
    d3.select("#vis").select('svg').remove();

    const margin = {left: 100, top: 50, bottom: 20, right: 20}
    const width = 900 - margin.left - margin.right
    const height = 700 - margin.top - margin.bottom

    const colors = ['#89cff0', '#357e57']

    YearScale = d3.scaleLinear(d3.extent(data_marvelpop, d => d.Year), [margin.left, margin.left + width - 130])
    categoryColorScale = d3.scaleLinear([0,1], colors)
    SeriesScale = d3.scaleLinear(d3.extent(data_marvelpop, d => d.Series), [margin.top + height - 100, margin.top])
    
    let svg = d3.select("#vis")
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('opacity', 1);

    let histxAxis = d3.axisBottom(YearScale)

    svg.append('g')
        .style("font", "17px arial")
        .attr('class', 'enrolment-axis')
        .attr('transform', 'translate(0, 600)')
        .attr('opacity', 1)
        .call(histxAxis)

    svg.selectAll('circle')
        .data(data_marvelpop)
        .enter()
        .append('circle')
        .transition().duration(600).delay((d, i) => i * 2)
            .attr('r', 6)
            .attr('cy', d =>  SeriesScale(d.Series))
            .attr('cx', d => YearScale(d.Year))    
            .attr('fill', d => categoryColorScale(d.Appearance))  
    
    svg.selectAll('circle')
        .on('mouseover', mouseOver)
        .on('mouseout', mouseOut)

    function mouseOver(d, i){

        d3.select(this)
            .transition('mouseover').duration(100)
            .attr('opacity', 1)
            .attr('stroke-width', 5)
            .attr('stroke', 'black')
            
        d3.select('#tooltip')
            .style('left', (d3.event.pageX + 10)+ 'px')
            .style('top', (d3.event.pageY - 25) + 'px')
            .style('display', 'inline-block')
            .attr('opacity', 1)
            .html(`<strong>Character:</strong> ${d.Character}`)
    }

    function mouseOut(d, i){
        d3.select('#tooltip')
            .style('display', 'none')
            .attr("opacity", 0)

        d3.select(this)
            .transition('mouseout').duration(100)
            .attr('opacity', 1)
            .attr('stroke-width', 0)
    }
}

function drawYearlyBubbles() {
    d3.select("#vis").select('svg').remove();

    // Constants for sizing
    var width = 950;
    var height = 800;

    var yearCenters = {
        2008: { x: width / 10},
        2010: { x: 2 * width / 10},
        2011: { x: 3 * width / 10},
        2012: { x: 4 * width / 10},
        2014: { x: 5 * width / 10},
        2015: { x: 6 * width / 10},
        2016: { x: 7 * width / 10},
        2017: { x: 8 * width / 10},
        2018: { x: 9 * width / 10}
    };

    var yearYCenters = {
        0: { y: height / 11 + 100},
        1: { y: 2 * height / 11+ 90},
        2: { y: 3 * height / 11+ 80},
        3: { y: 4 * height / 11+ 70},
        4: { y: 5 * height / 11+ 60},
        5: { y: 6 * height / 11+ 50},
        6: { y: 7 * height / 11+ 40},
        7: { y: 8 * height / 11+ 30},
        8: { y: 9 * height / 11+ 20},
        9: { y: 10 * height / 11+ 10}
    };

    // X locations of the year titles.
    var yearsTitleX = {
        2008:  width / 10 -40,
        2010: 2 * width / 10 - 30,
        2011: 3 * width / 10 - 20,
        2012: 4 * width / 10 - 10,
        2014: 5 * width / 10,
        2015: 6 * width / 10 + 10,
        2016: 7 * width / 10 + 20,
        2017: 8 * width / 10 + 30,
        2018: 9 * width / 10+ 40,
    };

    function nodeYearPos(d) {
        return yearCenters[d.year].x;
    }

    function nodeYearYPos(d) {
        return yearYCenters[d.series].y;
    }

    // @v4 strength to apply to the position forces
    var forceStrength = 0.03;

    // These will be set in create_nodes and create_vis
    var bubbles = null;

    // Charge function that is called for each node.
    // As part of the ManyBody force.
    // This is what creates the repulsion between nodes.
    //
    // Charge is proportional to the diameter of the
    // circle (which is stored in the radius attribute
    // of the circle's associated data.
    //
    // This is done to allow for accurate collision
    // detection with nodes of different sizes.
    //
    // Charge is negative because we want nodes to repel.
    // @v4 Before the charge was a stand-alone attribute
    //  of the force layout. Now we can use it as a separate force!
    function charge(d) {
        return -Math.pow(d.radius, 2) * forceStrength;
    }

    
    // Here we create a force layout and
    // @v4 We create a force simulation now and
    //  add forces to it.
    var simulation = d3.forceSimulation()
        .velocityDecay(0.2)
        // @v4 Reset the 'x' force to draw the bubbles to their year centers
        .force('x', d3.forceX().strength(forceStrength).x(nodeYearPos))
        .force('y', d3.forceY().strength(forceStrength).y(nodeYearYPos))
        .force('charge', d3.forceManyBody().strength(-15))
        .on('tick', () => {
            bubbles
                .attr('cx', d => d.x)
                .attr('cy', d => d.y)
        });

    // @v4 Force starts up automatically,
    //  which we don't want as there aren't any nodes yet.
    simulation.stop();

    let svg = d3.select('#vis')
        .append('svg')
        .attr('width', 1000)
        .attr('height', 950);

    var yearsData = d3.keys(yearsTitleX);
    var years = svg.selectAll('.year')
      .data(yearsData);

    years.enter().append('text')
      .attr('class', 'year')
      .attr('x', function (d) { return yearsTitleX[d]; })
      .attr('y', 80)
      .attr('text-anchor', 'middle')
      .text(function (d) { return d; });

    // Create a SVG element inside the provided selector
    // with desired size.
    var defs = svg.append("defs")

    bubbles = svg.selectAll('.bubble')
        .data(data_first_appearance, function (d) { return d.id; });

    defs.selectAll(null)
        .data(data_first_appearance)
        .enter()
        .append("pattern")
        .attr("id", function(d){
          return d.name.toLowerCase().replace(/ /g, "-")
        }) //set the id here
        .attr("height", "100%")
        .attr("width", "100%")
        .attr("patternContentUnits", "objectBoundingBox")
        .append("image")
        .attr("height", 1)
        .attr("width", 1)
        .attr("preserveAspectRatio", "none")
        .attr("xmlns:xlink", "http://w3.org/1999/xlink")
        .attr("href", function(d) {
          return d.img_path
        });
    
    var bubblesE = bubbles.enter().append('circle')
        .classed('bubble', true)
        .attr('r', 0)
        .attr("id", function(d){
            return d.name.toLowerCase().replace(/ /g, "-") })
        .style("fill", function(d) {
            return "url(#" + d.name.toLowerCase().replace(/ /g, "-") + ")" 
        })
        .attr("stroke", "black")
        .on("mouseover", mouseOverAppearance)
        .on("mouseout", mouseOutAppearance);

    // @v4 Merge the original empty selection and the enter selection
    bubbles = bubbles.merge(bubblesE);

    // Fancy transition to make bubbles appear, ending with the
    // correct radius
    bubbles.transition()
      .duration(2000)
      .attr('r', function(d) {return d.radius/2 + 10});

    // Set the simulation's nodes to our newly created nodes array.
    // @v4 Once we set the nodes, the simulation will start running automatically!
    simulation.nodes(data_first_appearance);
    // @v4 We can reset the alpha value and restart the simulation
    simulation.alpha(1).restart();
}

function drawIntro() {
    d3.select("#vis").select('svg').remove();

    // Constants for sizing
    var width = 1000;
    var height = 800;
  
    // sort them to prevent occlusion of smaller nodes.
    data_first_appearance.sort(function (a, b) { return b.value - a.value; });
    console.log(data_first_appearance);

    // Locations to move bubbles towards, depending
    // on which view mode is selected.
    var center = { x: 5 * width / 10, y: height / 2 };

    // @v4 strength to apply to the position forces
    var forceStrength = 0.5;

    // These will be set in create_nodes and create_vis
    var bubbles = null;

    // Charge function that is called for each node.
    // As part of the ManyBody force.
    // This is what creates the repulsion between nodes.
    //
    // Charge is proportional to the diameter of the
    // circle (which is stored in the radius attribute
    // of the circle's associated data.
    //
    // This is done to allow for accurate collision
    // detection with nodes of different sizes.
    //
    // Charge is negative because we want nodes to repel.
    // @v4 Before the charge was a stand-alone attribute
    //  of the force layout. Now we can use it as a separate force!
    function charge(d) {
        return -Math.pow(d.radius, 2.1) * forceStrength;
    }

    // Here we create a force layout and
    // @v4 We create a force simulation now and
    //  add forces to it.
    var simulation = d3.forceSimulation()
        .velocityDecay(0.2)
        .force('x', d3.forceX().strength(forceStrength).x(center.x))
        .force('y', d3.forceY().strength(forceStrength).y(center.y))
        .force('charge', d3.forceManyBody().strength(charge))
        .on('tick', () => {
            bubbles
                .attr('cx', d => d.x)
                .attr('cy', d => d.y)
        });

    // @v4 Force starts up automatically,
    //  which we don't want as there aren't any nodes yet.
    simulation.stop();

    let svg = d3.select('#vis')
        .append('svg')
        .attr('width', 1000)
        .attr('height', 950);

    // Create a SVG element inside the provided selector
    // with desired size.
    var defs = svg.append("defs")

    var bubbles = svg.selectAll('.bubble')
        .data(data_first_appearance, function (d) { return d.id; })

    defs.selectAll(null)
        .data(data_first_appearance)
        .enter()
        .append("pattern")
        .attr("id", function(d){
          return d.name.toLowerCase().replace(/ /g, "-")
        }) //set the id here
        .attr("height", "100%")
        .attr("width", "100%")
        .attr("patternContentUnits", "objectBoundingBox")
        .append("image")
        .attr("height", 1)
        .attr("width", 1)
        .attr("preserveAspectRatio", "none")
        .attr("xmlns:xlink", "http://w3.org/1999/xlink")
        .attr("href", function(d) {
          return d.img_path
        });
    
    var bubblesE = bubbles.enter().append('circle')
        .classed('bubble', true)
        .attr('r', 0)
        .attr("id", function(d){
            return d.name.toLowerCase().replace(/ /g, "-") })
        .style("fill", function(d) {
            return "url(#" + d.name.toLowerCase().replace(/ /g, "-") + ")" 
        })
        .attr("stroke", "black")
        .attr("cx", d=>d.x)
        .attr("cy", d=>d.y)
        .on('mouseover',mouseOverAppearance)
        .on('mouseout', mouseOutAppearance);

    // @v4 Merge the original empty selection and the enter selection
    bubbles = bubbles.merge(bubblesE);

    // Fancy transition to make bubbles appear, ending with the
    // correct radius
    bubbles.transition()
      .duration(2000)
      .attr('r', function (d) { return d.radius; });

    // Set the simulation's nodes to our newly created nodes array.
    // @v4 Once we set the nodes, the simulation will start running automatically!
    simulation.nodes(data_first_appearance);

    // @v4 Reset the 'x' force to draw the bubbles to the center.
    simulation.force('x', d3.forceX().strength(forceStrength).x(center.x));

    // @v4 We can reset the alpha value and restart the simulation
    simulation.alpha(1).restart();
}

function mouseOverAppearance(d, i){

    d3.select(this)
        .transition('mouseover').duration(100)
        .attr('opacity', 1)
        .attr('stroke-width', 5)
        .attr('stroke', 'black')
        
    d3.select('#tooltip')
        .style('left', (d3.event.pageX + 10)+ 'px')
        .style('top', (d3.event.pageY - 25) + 'px')
        .style('display', 'inline-block')
        .attr('opacity', 1)
        .html('<span class="name">Name: </span><span class="value">' +
              d.name +
              '</span><br/>' +
              '<span class="name">Total number of appearances in MCU: </span><span class="value">' +
              numberWithCommas(d.value) +
              '</span><br/>' +
              '<span class="name">First year of appearance: </span><span class="value">' +
              d.year +
              '</span>')
}

function mouseOutAppearance(d, i){
    d3.select('#tooltip')
        .style('display', 'none')

    d3.select(this)
        .transition('mouseout').duration(100)
        .attr('opacity', 1)
        .attr('stroke-width', 0)
}

function hasTwitter(d, i){
    if (d.followers > 0) {
        return "url(#" + d.character.toLowerCase().replace(/ /g, "-") + ")" ;
    } else {
        return '#89cff0';
    }
}
  
function ticked() {
    links
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    nodes_network
        .attr("cx", function (d) { return d.x+6; })
        .attr("cy", function(d) { return d.y-6; });
}

// Formatting function
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//Array of all the graph functions
//Will be called from the scroller functionality

let activationFunctions = [
    drawIntro,
    drawYearlyBubbles,
    drawBar,
    drawNetwork,
    drawLollipop,
    drawLollipopAvgScreenTime,
    drawBubbles,
    drawScatter,
    drawEnding,
]

//All the scrolling function
//Will draw a new graph based on the index provided by the scroll


let scroll = scroller()
    .container(d3.select('#graphic'))
scroll()

let lastIndex, activeIndex = 0

scroll.on('active', function(index){
    d3.selectAll('.step')
        .transition().duration(500)
        .style('opacity', function (d, i) {return i === index ? 1 : 0.1;});
    
    activeIndex = index
    let sign = (activeIndex - lastIndex) < 0 ? -1 : 1; 
    let scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
    scrolledSections.forEach(i => {
        activationFunctions[i]();
    })
    lastIndex = activeIndex;

})

scroll.on('progress', function(index, progress){
    if (index == 2 & progress > 0.7){

    }
})