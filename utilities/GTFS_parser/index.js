/**
 * All this code is commented out because the fs module may bring up issue when compilig for mobile
 * I found it necessary ro add the code that i used to split the GTFS data for future reference
 */

const fs = require('fs');

const GFTS_FEED = {};

fs.readdir("../../GTFS_FEED", (err, data) => {

  if(err)
    console.log(err);
  else {
    console.log("Files:");
    console.log(data);

    data.forEach( feed => {

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

    });

  }

});
