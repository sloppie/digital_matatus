/**
 * All this code is commented out because the fs module may bring up issue when compilig for mobile
 * I found it necessary ro add the code that i used to split the GTFS data for future reference
 */

const fs = require('fs');

const GFTS_FEED = {};

class GTFSParse {

  static parseRoutes(feed) {
      if(feed == "routes.txt") {
        let fileJSON = {};
        // The main reason for the pre-computing of all this routes is so as to enable the easy parsing of
        // search indexes throughout the data to yield a result.
        // This pre-computing makes sense so as to help eliviate some of the work form the user's machines
        // since the target demographic is people from "low-income neighbourhoods" thus have lowly-speced phones
        // which need all the help to make the application seem smooth and fast.
        let routeLongNameJSON = {};
        let routeShortNameJSON = {};
        let routeTypeJSON = {};

        fileName = feed.replace(/.txt/gi, "");
        console.log("parsing: " + fileName);
  
        let fileData = fs.readFileSync(`../../GTFS_FEED/${feed}`, "utf8");
        let rows = fileData.split("\n");

        // removes the first value as this value is the column titles ans so forth

        let columnNames = rows.shift().split(",");
        

        // the data's last value consists of a new line thus it is required that the last row be removed
        rows.pop();

        rows.forEach(row => {
          let rowData = {};
          // This was working well until we found that there are long names that are enclosed by "" and have
          // commas in them. This thus called for that to be tested fisrt before we could split at the comma
          // part.
          // @example problem: 70805046P10,UON,046P,"Ambassadeur,Kabete,Kawangware",3
          // Solution:
          // Grab the quoted string and replace the enclosed quotation with a token: eg: '?'.
          // after splitting the the CSV, replace '?' with the original word
          let column = null;

          if(/"[\w+\W+]*"/g.test(row)) { // trying to weed out the cases mentioned above
            console.log("matched such a token: " + row);
            let replaced = row.replace(/"[\w+|\W+]*"/g, "?");
            let replaced_substr = row.substring(
                row.indexOf("\""),  
                row.indexOf("\",")
            );

            column = replaced.split(",");
            column[3] = replaced_substr.replace(/"/gi, "").replace(/,/gi, "-"); // remove ',' and '"'
          } else {
            column = row.split(",");
          }
          
          column.forEach((value, i) => {
            rowData[columnNames[i]] = value;
          });

          // original data
          fileJSON[column[0]] = rowData;
          // route short form name data
          routeShortNameJSON[column[2]] = rowData;
          // route long form name data
          routeLongNameJSON[column[3]] = rowData;
          // route type name data
          routeTypeJSON[column[4]] = rowData;
        });

        // create a whole array containing all forms of data to be written to the system folder for the
        // route search index
        let newDataArr = [
          {fileName, fileJSON}, 
          {fileName: "routeShortName", fileJSON: routeShortNameJSON}, 
          {fileName: "routeLongName", fileJSON: routeLongNameJSON}, 
          {fileName: "routeType", fileJSON: routeTypeJSON}
        ]

        console.log(routeShortNameJSON["046P"]);

        // create folder to store the route data
        if(!fs.existsSync("../../GTFS_FEED/routes")) {
          fs.mkdirSync("../../GTFS_FEED/routes"); // sync to avoid processing before the dir is created.
        }

        newDataArr.forEach(file => {
          let { fileName, fileJSON } = file;
  
          fs.writeFile(`../../GTFS_FEED/routes/${fileName}.json`, JSON.stringify(fileJSON), (err) => {
            
            if(err)
              console.log("Unable to write to file")
            else
              console.log(`Data written to file: ${fileName}.json`);
  
          });

        });

      }
  }

  static parseTrips() {
    let parsedData = {};
    let reverseTrips = {}; // this stores the trip IDs as the ket to help look up easier
    let tripsData = fs.readFileSync("../../GTFS_FEED/trips.txt", "utf8");

    let rows = tripsData.split("\n");
    console.log(tripsData.length);
    let labels = rows.shift().split(",");
    console.log(labels);
    rows.pop(); // the last element is black due to the extra '\n' at the end of the file

    for(let i=0; i<rows.length; i+=2) {
      let fromRow = rows[i].split(",");
      let toRow = rows[i + 1].split(",");
      let from = {};
      let to = {};

      for(let j=1; j<labels.length; j++) {
        from[labels[j]] = fromRow[j]; // represented by the 0 in direction_id
        to[labels[j]] = toRow[j]; // represented by the 1 in direction_id
      }

      parsedData[fromRow[0]] = {from, to};
      reverseTrips[from.trip_id] = fromRow[0]; // {"trip_id": "route_id"}
      reverseTrips[to.trip_id] = toRow[0]; // {"trip_id": "route_id"}
    }

    if(!fs.existsSync("../../GTFS_FEED/trips"))
      fs.mkdirSync("../../GTFS_FEED/trips");

    fs.writeFile("../../GTFS_FEED/trips/trips.json", JSON.stringify(parsedData), (err) => {
      if(err)
        console.log("error writing to file 'trips.json'");
      else {
        console.log(Object.keys(parsedData).length + " routes written to trips.json");
      }
    });

    fs.writeFile("../../GTFS_FEED/trips/reverse_trips.json", JSON.stringify(reverseTrips), (err) => {
      if(err)
        console.log("error writing to file 'reverse_trips.json'");
      else {
        console.log(Object.keys(reverseTrips).length + " routes written to reverse_trips.json");
      }
    });

  }
  // "805...11"{
  // from: {
  //   service_id: 'DAILY',
  //   trip_id: '80105110',
  //   trip_headsign: 'Kikuyu',
  //   direction_id: '0',
  //   shape_id: '80105110'
  // },
  // to: {
  //   service_id: 'DAILY',
  //   trip_id: '80105111',
  //   trip_headsign: 'Odeon',
  //   direction_id: '1',
  //   shape_id: '80105111'
  // }

  /**
   * @description this function creates an array of longitued and lattitued for each 
   * all the shapes with a unique shape_id
   */
  static parseShapes() {
    let stops = {};
    let shapesData = fs.readFileSync("../../GTFS_FEED/shapes.txt", "utf8");
    let rows = shapesData.split("\n");
    let labels = rows.shift().split(",");
    rows.pop() // this is because the last value in the file is an empty line
    
    rows.forEach(row => {
      let columns = row.split(",");
      
      if(stops[columns[0]] == undefined)
        stops[columns[0]] = []; // create a new point for shape

      let coordinates = {};
      coordinates[labels[1]] = columns[1]; // lat
      coordinates[labels[2]] = columns[2]; // long

      stops[columns[0]].push(coordinates);
    });

    if(!fs.existsSync("../../GTFS_FEED/shapes"))
      fs.mkdirSync("../../GTFS_FEED/shapes");
    
    fs.writeFile("../../GTFS_FEED/shapes/shape.json", JSON.stringify(stops), (err) => {

      if(err)
        console.log("Error writing shapes to file");
      else
        console.log(Object.keys(stops).length + " Route shapes written");

    });

  }

  static parseStops() {
    let stops = {};
    let shapesData = fs.readFileSync("../../GTFS_FEED/stops.txt", "utf8");
    let rows = shapesData.split("\n");
    let labels = rows.shift().split(",");
    rows.pop() // this is because the last value in the file is an empty line
    
    rows.forEach(row => {
      let columns = row.split(",");
      
      let coordinates = {};
      coordinates[labels[2]] = columns[2]; // lat
      coordinates[labels[3]] = columns[3]; // long

      stops[columns[0]] = {name: columns[1], coordinates};
    });

    if(!fs.existsSync("../../GTFS_FEED/stops"))
      fs.mkdirSync("../../GTFS_FEED/stops");
    
    fs.writeFile("../../GTFS_FEED/stops/stops.json", JSON.stringify(stops), (err) => {

      if(err)
        console.log("Error writing shapes to file");
      else
        console.log(stops["0010OTC"]);

    });
  }

  static parseStopTimes() {
    const reverseTrips = require("../../GTFS_FEED/trips/reverse_trips.json");
    let comprehensiveRoute = {};
    let stopTimes = fs.readFileSync("../../GTFS_FEED/stop_times.txt", "utf8");
    let rows = stopTimes.split("\n");
    let labels = rows.shift().split(",");
    rows.pop(); // the last element is just a new line

    rows.forEach(row => {
      let columns = row.split(",");
      let route_id = reverseTrips[columns[0]];
      
      if(comprehensiveRoute[route_id] == undefined)
        comprehensiveRoute[route_id] = {
          "stops": [],
          "from": [],
          "to": []
        };
      
      if(comprehensiveRoute[route_id].stops.indexOf(columns[3]) == -1) {
        comprehensiveRoute[route_id].stops.push(columns[3]);        
      }

      let dir = Number(columns[0].split("").pop()); // returns either a '1' or a '0';

      if(dir) { // is direction is 1
        comprehensiveRoute[route_id].to.push(columns[3]);
      } else { // if direction is 0
        comprehensiveRoute[route_id].from.push(columns[3])
      }

    });

    if(!fs.existsSync("../../GTFS_FEED/comprehensive_routes"))
      fs.mkdirSync("../../GTFS_FEED/comprehensive_routes");
    
    fs.writeFile(
      "../../GTFS_FEED/comprehensive_routes/comprehensive_routes.json", // path
      JSON.stringify(comprehensiveRoute), // data
      (err) => { // error callback

        if(err)
          console.log("Error writing the comprehensive routes");
        else {
          console.log(comprehensiveRoute["10000107D11"]);
          console.log(Object.keys(comprehensiveRoute).length + " routes written");          
        }

      }
    )

  }

}


fs.readdir("../../GTFS_FEED", (err, data) => {

  if(err)
    console.log(err);
  else {
    console.log("Files:");
    console.log(data);

    data.forEach( feed => {
      if(feed == "routes.txt") {
        // GTFSParse.parseRoutes(feed);
      } else if(feed == "trips.txt") {
        // GTFSParse.parseTrips();
      } else if(feed == "shapes.txt") {
        // GTFSParse.parseShapes();
      } else if(feed == "stops.txt") {
        // GTFSParse.parseStops();
      } else if(feed == "stop_times.txt") {
        GTFSParse.parseStopTimes();
      }

    });

  }

});
