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
        AsyncStorage.setItem("savedReports", JSON.stringify(""), (err) => {
          
          if(err)
            console.log(err);

        });
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
 * interfaces with the servers isUser API to provide a response and execute a callback on completion
 * 
 * @param {string} email email to be crosschecked in the database
 * @param {(userDetails:String) => {}} onSuccess callback to be executed onSuccess, takes in a payload that is sent back
 * @param {(reason:String) => {}} onErr callback to be executed if an error occurs, reason is passed in
 */
export const isUser = (email, onSuccess, onErr) => {

  fetch(`http://192.168.43.89:3000/api/user/isUser${email}`)
    .then(response => response.json())
    .then(data => {

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
