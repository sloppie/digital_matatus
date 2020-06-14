/**
 * This class is used in the handling of a stored report.
 * Instead of writing unique methods for all the screens that require presentablility of a report,
 * This class can be used to prevent code redundancy and make it easier to alter for all scenarios.
 * This class will be able to parse the report to give:
 *  - Human understandable incident descriptions
 *  - Human understandable location description
 *  - Human understandable culprit description
 *  - report_id
 */
export default class ReportParser {

  constructor(report) {
    this.report = report;
    this.incidentDescription = JSON.parse(report.incidentDescription);
    this.culpritDescription = JSON.parse(report.culpritDescription);
    // essentials
    this._id = report._id;
    this.date = new Date(this.incidentDescription.date).toDateString();
    this.route_short_name = require('../../GTFS_FEED/routes/routes.json')[this.culpritDescription.routeID];
  }

  get location() {
    return Object.freeze({
      INSIDE_BUS: `Inside a bus ${this.culpritDescription.saccoName}`,
      ON_BUS_TERMINAL: `On the bus terminal of route ${this.route_short_name}`,
      ON_BUS_ENTRANCE: `On the bus entrance of route ${this.route_short_name}`
    });
  }

  /**
   * @returns {String} that will be viewd by the user (aims to be verbose and understandable) 
   */
  generateReportMessage = () => {

    let partyInvolved = (
      (this.culpritDescription.culpritType == "Driver")
        ? "a matatu driver"
        : (this.culpritDescription.culpritType == "Conductor")
          ? "a matatu conductor"
          : (this.culpritDescription.culpritType == "Route Handler")
            ? "the matatu route handler"
            : "a third party (pedestrian motorist etc.)"
    );

    let location = (
      (this.incidentDescription.location.type == "BUS_TERMINAL")
        ? "on the bus terminal"
        : (this.incidentDescription.location.type == "ON_BUS_ENTRANCE")
          ? "as the victim entered the bus"
          : "inside the bus"
    );

    let message = `An incident involving ${partyInvolved} which ocurred ${location}`
    return message;
  }

  /**
   * @returns The title of the report that is to be viewed
   */
  generateReportTitle() {

    let shortLocation = Object.freeze({
      INSIDE_BUS: `Inside a Bus`,
      BUS_TERMINAL: `on The Bus Terminal`,
      ON_BUS_ENTRANCE: `on The Bus Entrance`
    });

    return `Incident ${shortLocation[this.incidentDescription.location.type]}`;
  }

  /**
   * @returns {String} of the location where the incident happened
   */
  getLocation() {
    return this.location[this.incidentDescription.location.type];
  }

}