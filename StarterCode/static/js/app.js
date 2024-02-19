let url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"
d3.json(url).then(function (data) {
  
    // Get data
  console.log(data);
  global_data = data; // set global data variable for use in the on change event later

  // Use D3 to select the dropdown
  let dropdown = d3.select("#selDataset");

  for (let i = 0; i < data.names.length; i++){
    let name = data.names[i];
    dropdown.append("option").text(name);
  }

// Grab data for a person
let person = data.names[0];
let person_data = data.samples.filter(row => row.id === person)[0];
let meta_data = data.metadata.filter(row => row.id == person)[0]; 

console.log(meta_data);

// make visualizations
makeBar(person_data);
makeBubble(person_data);
makeMeta(meta_data);
});

// Display meta data function
function makeMeta(meta_data) {
    let panel = d3.select("#sample-metadata");
    panel.html("");
  
    // loop through each key in the dictionary
    let keys = Object.keys(meta_data);
    for (let i = 0; i < keys.length; i++){
      let key = keys[i];
      panel.append("p").text(`${key}: ${meta_data[key]}`);
    }
  }
  
  // Make a bar chart function 
  function makeBar(person_data) {
      
      let sampleValues = person_data.sample_values.slice(0, 10).reverse();
      let otuIds = person_data.otu_ids.slice(0, 10).reverse();
      let otuLabels = person_data.otu_labels.slice(0, 10).reverse();
  
      let trace1 = {
        x: sampleValues,
        y: otuIds.map(id => `OTU ${id}`),
        text: otuLabels,
        type: "bar",
        orientation: "h",
        marker: {
            color: 'red'
        }
      };
  
      let traces = [trace1];
  
      let layout = {
        title: "Top 10 OTUs (Operational Taxonomic Units)",
        xaxis: { title: "Sample Values" },
        yaxis: { title: "OTU IDs" }
      };
  
      Plotly.newPlot("bar", traces, layout);
  }
  
  // Make a bubble chart function
  function makeBubble(person_data) {
    let sampleValues = person_data.sample_values;
    let otuIds = person_data.otu_ids;
    let otuLabels = person_data.otu_labels;
  
    let trace1 = {
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: "markers",
      marker: {
        color: otuIds,
        size: sampleValues
      }
    };
  
    let traces = [trace1];
  
    let layout = {
      title: "OTUs Observed",
      xaxis: { title: "OTU IDs" },
      yaxis: { title: "# of Observed" }
    };
  
    Plotly.newPlot("bubble", traces, layout);
  
  }
  

  function optionChanged(person) {
    let person_data = global_data.samples.filter(row => row.id === person)[0];
    let meta_data = global_data.metadata.filter(row => row.id == person)[0];
  
    //Make charts
    makeBar(person_data);
    makeBubble(person_data);
    makeMeta(meta_data);
  }
  