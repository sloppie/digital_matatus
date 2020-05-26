//
const routeParse = () => {
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

const tripsParse = () => {

}


class GTFSSearch {

  constructor(key) {
    this.data = null;

    switch(key) {
      case "routes":
        this.data = routeParse();
        break;
    }

  }

  search(data, regExSequence) {
    // console.log(regExSequence)
    let result = [];
    let RES = new RegExp(regExSequence, "gi");

    for(let child in data) {
      
      if(RES.test(child)) { 
        result.push({matched: child, data: data[child]});
      }

    }

    return result;
  }

  async searchSpecific(key, regExSequence) {
    let results = [];
    let {data} = this.data.filter(val => val.name == key)[0];
    
    results = await this.search(data, regExSequence);
    console.log(results.length)

    return results;
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
