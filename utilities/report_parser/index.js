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
    /**
     * ```js
     * {
     *  "date": 1591438494412,
     *  "location": {
     *    "coordinates": {
     *      "latitude": -1.1843883333333334,
     *      "longitude": 36.68218
     *    },
     *    "type": "INSIDE_BUS"
     *  },
     *  "harassmentFlags": {
     *    "Verbal": [
     *      "Refering to an adult as a \\"girl\\", \\"hunk\\", \\"babe\\" or \\"honey\\"",
     *      "Whistling at someone, e.g:cat calls"
     *    ]
     *  },
     *  "media": {
     *    "audio": [],
     *    "photo": [],
     *    "video": []
     *  }
     * }'
     * ```
     */
    this.incidentDescription = JSON.parse(report.incidentDescription);
    this.culpritDescription = JSON.parse(report.culpritDescription);
    // essentials
    this._id = report._id;
    this.date = new Date(this.incidentDescription.date).toDateString();
    this.route_short_name = require('../../GTFS_FEED/routes/routes.json')[this.culpritDescription.routeID].route_short_name;
  }

  get location() {
    return Object.freeze({
      INSIDE_BUS: `Inside a bus from ${this.culpritDescription.saccoName}`,
      BUS_TERMINAL: `On the bus terminal of RT ${this.route_short_name}`,
      ON_BUS_ENTRANCE: `On the bus entrance of RT ${this.route_short_name}`
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

  getHarassmentFlags() {
    let harassmentFlags;

    harassmentFlags = this.incidentDescription.harassmentFlags;

    if(!harassmentFlags)
      harassmentFlags = this.incidentDescription.flags;

    return harassmentFlags;
  }

  /**
   * Loops through all media type keys to look if there is any media that is stored
   * in relation with the respective report
   * 
   * @returns {Boolean} boolean on whether there is any media found linked to the report
   */
  hasMedia() {
    return Object.keys(this.incidentDescription.media)
      .some(mediaType => this.incidentDescription.media[mediaType].length > 0);
  }

  hasPhotos() {
    return this.incidentDescription.media.photo.length > 0;
  }

  hasVideos() {
    return this.incidentDescription.media.video.length > 0;
  }

  hasAudios() {
    return this.incidentDescription.media.audio.length > 0;
  }

  /**
   * @returns {Array<String>} the array of link to photos linked to the respective report
   */
  fetchPhotos() {
    return this.incidentDescription.media.photo;
  }

  /**
   * @returns {Array<String>} the array of link to videos linked to the respective report
   */
  fetchVideos() {
    return this.incidentDescription.media.video;
  }

  /**
   * @returns {Array<String>} the array of link to audios linked to the respective report
   */
  fetchAudios() {
    return this.incidentDescription.media.audio;
  }

}