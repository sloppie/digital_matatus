//
const conditionalParse = () => {
  // routes json
  const routeShortName = require("../../GTFS_FEED/routes/routeShortName.json")
  const routeLongName = require("../../GTFS_FEED/routes/routeLongName.json")
  const routeType = require("../../GTFS_FEED/routes/routeType.json")
  
  const iterable = [
    {name: "Route Short Name", data: routeShortName},
    {name: "Route Long Name", data: routeLongName},
    {name: "Route Type", data: routeType}
  ]

  return iterable;
}


class GTFSSearch {

  constructor(key) {
    this.data = null;

    switch(key) {
      case "routes":
        this.data = conditionalParse();
        break;
    }

  }

  search(data, regExSequence): Promise<Array<Object>> {
    let result = [];
    let RES = new RegExp(regExSequence, "gi");

    for(let child in data) {
      
      if(RES.test(child)) {
        result.push({matched: child, data: data[child]});
      }

    }

    return result;
  }

  indexSearch(charSequence) {

    return new Promise((resolve, reject) => {
      let searchResults = []
      this.data.forEach(child => {
        searchResults.push({name: child.name, results: this.search(child.data, charSequence)})
      });

      if(searchResults.length) {
        resolve(searchResults);
      } else {
        reject(searchResults);
      }

    });

  }

}

module.exports = {
  GTFSSearch,
};
