import AsyncStorage from "@react-native-community/async-storage"

/**
 * This function is used to resend reports when internet connection is back
 */
export const resendReport = async () => {
  let savedReport = JSON.parse(await AsyncStorage.getItem("savedReport"));

  if(typeof savedReport === "string" && savedReport !== "") {
    console.log(Object.keys(savedReport));

    fetch("http://192.168.43.89:3000/api/report/new", {
      method: "POST",
      body: JSON.stringify(savedReport),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    }).then(response => response.json()).then(data => {
      
      if(data) {
        sent = true; // sent
        AsyncStorage.multiSet(
          [
            ["savedReports", JSON.stringify("")],
            ["reportToBeSaved", JSON.stringify(data.report_id)]
          ]
        );
          
      }

    }).catch(err => console.log(err));

  }

}

/**
 * this is used as a function to interface with the online API while filing reports
 * 
 * @param {{}} report details to be sent
 * @param {(payload: {}) => {}} onSuccess callback to be executed onSuccess
 * @param {() => {}} onErr callback to be executed on failure
 */
export const fileReport = (report, onSuccess, onErr) => {

  fetch(
    "http://192.168.43.89:3000/api/report/new",
    {
      method: "POST",
      body: JSON.stringify(report),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
    }
  ).then(response => response.json()).then(data => {
    
    if(data)
      onSuccess(data);
    else
      onErr();

  }).catch(err => {
    console.log(err);
    onErr();
  });

}

/**
 * 
 * @param {String} report_id report id of the data to be altered
 * @param {{}} data data to be sent to the server
 * @param {(payload: {}) => {}} onSuccess callback to be executed on success
 * @param {() => {}} onErr callbackk to be executed on err
 */
export const sendCulpritInformation = (report_id, reportData, onSuccess, onErr) => {

  fetch(
    "http://192.168.43.89:3000/api/report/" + report_id + "/add/culpritInformation",
    {
      method: "PUT",
      body: JSON.stringify(reportData),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
    }
  ).then(response => response.json()).then(data => {
    
    if(data)
      onSuccess();

  }).catch(err => {
    console.log(err);
    onErr();
  });

}

export const updateMatatuDetails = (report_id, payload, onSuccess, onErr) => {

  console.log("Payload being sent" + payload);

  fetch(
    "http://192.168.43.89:3000/api/report/" + report_id + "/add/matatuDetails",
    {
      method: "PUT",
      body: JSON.stringify(payload),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
    }
  ).then(response => response.json()). then(data => {
    
    if(data) {
      onSuccess();
    } else {
      onSuccess();
    }

  }).catch(err => {
    console.log(err);
    onErr();
  })

}

/**
 * interfaces with the servers isUser API to provide a response and execute a callback on completion
 * 
 * @param {string} email email to be crosschecked in the database
 * @param {(userDetails:String) => {}} onSuccess callback to be executed onSuccess, takes in a payload that is sent back
 * @param {(reason:String) => {}} onErr callback to be executed if an error occurs, reason is passed in
 */
export const isUser = (email, onSuccess, onErr) => {

  console.log('Checking for user...' + email);

  fetch(`http://192.168.43.89:3000/api/user/isUser/${email}`)
    .then(response => response.json())
    .then(data => {
      console.log(data);

      if (data)
        onSuccess(data);
      else
        onErr("Data not found")

    }).catch(err => {
      console.log(err);
      onErr("Server error")
    });

}

/**
 * 
 * @param {String} email email data is being gathered on
 * @param {(payload:String) => {}} onSuccess callback to executed on successful get of data, 
 * payload is passed in
 * @param {() => {}} onErr callback to be executes on error
 */
export const getLoginDetails = (email, onSuccess, onErr) => {

  fetch(`http://192.168.43.89:3000/api/user/login?email=${email}`)
    .then(response => response.json())
    .then(data => {
      
      if(data)
        onSuccess(data);

    }).catch(err => {
      console.log(err);
      onErr();
    });

}

export const fetchReport = () => {}

export const fetchRouteReports = (route_id, onSuccess, onErr) => {

  fetch(`http://192.168.43.89:3000/api/routes/${route_id}/reports`)
    .then(response => response.json())
    .then(data => {

      if(data)
        onSuccess(data);
      else
        onSuccess([]);

    }).catch(err => {
      console.log(err);
      onErr();
    });

}

/**
 * http://localhost/find/categories=route_id;date;location_type;flags&route_id={string}&date={timestamp}:{timestamp}&location_type={string}&flags=Verbal;Non-verbal;Physical&key={string}
 * 
 * Queries the route linked above to return an array of result values
 * @param {{}} filterObject object containing all categories to filter by
 * @param {() => {}} onSuccess callback to be executed on success
 * @param {() => {}} onErr callback to be executed on error
 */
export const filterByCategories = (filterObject, onSuccess, onErr) => {
  // console.log(filterObject)
  let filterKeys = Object.keys(filterObject);
  let length = filterKeys.length;

  const generateCategories = () => {
    let categories = "?categories=";

    filterKeys.forEach((category, index) => {
      
      if((index + 1) == length)
        categories += `${category}`;
      else
        categories += `${category};`;

    });

    console.log(categories);
    return categories;
  }

  const generateCategoryValues = () => {
    let values = "";

    filterKeys.forEach(category => {
      values += `&${category}=${filterObject[category]}`
    });

    console.log(values);
    return values;
  }

  fetch(`http://192.168.43.89:3000/api/report/find${generateCategories()}${generateCategoryValues()}`)
    .then(response => response.json())
    .then(data => {
 
      if(data)
        onSuccess(data);
      else {
        onSuccess([]);
      }

    }).catch(err => {
      console.log(err);
      onErr();
    });
}

// http://localhost/find/categories=route_id;date;location_type;flags&route_id={string}&date={timestamp}:{timestamp}&location_type={string}&flags=Verbal;Non-verbal;Physical&key={string}
export const fetchReportsByRoute = (route_id, onSuccess, onErr) => {

  fetch(
    "http://192.168.43.89:3000/api/report/find?categories=route_id&route_id=" + route_id
  ).then(response => response.json()).then(data => {
    
    if(data)
      onSuccess(data);
    else
      onSuccess([]);
    
  }).catch(err => {
    console.log(err);
    onErr();
  })

}

/**
 * Query the report collection in the database 
 * 
 * @param {Array<String>} categories this is a string of viable categories that can be used to query the data
 * @param {{"category": String}} valuesObj this is an object that now contains 
 * all the categories with their values
 * @param {(payload: Object) => {}} onSuccess function executed onSuccess, payload passed in
 * @param {() => {}} onErr function to be executed if an error occurrs
 */
export const queryReports = (categories, valuesObj, onSuccess, onErr) => {

  // example output: category=route_id;date;location_type;flags
  const unpackCategories = () => {
    let categoryParamString = "category=";

    categories.forEach((category, index) => {

      if(index == 0)
        categoryParamString += category;
      else(index == (category.length - 1))
        categoryParamString += `;${category}`;

    });    

    return categoryParamString;
  }

  // example output: &route_id=80170111&date=234342334:253553634&location_type=INSIDE_BUS&flags=Verbal;Physical
  const unpackCategoryValues = () => {
    let parameters = "";

    for(let i in valuesObj) {
      parameters += `&${i}=${valuesObj[i]}`;
    }

    return parameters;
  }

  fetch(
    `http://192.168.43.89:3000/api/reports/find?${unpackCategories()}${unpackCategoryValues()}`
  ).then(response => response.json())
    .then(data => {

      if(data)
        onSuccess(data);

    }).catch(err => {
      console.log(err);
      onErr();
    });

}
