# DIGITAL MATATUS HARASSMENT REPORTING APPLICATION

# Introduction
This application was created with the sole purpose of helping report incidences of Sexual Harassment that occured on the Kenyan Public Transport sector. As such, all features in the application are geared towards making `filing` and `viewing` of the reports filled with the relation to the route easier.
Through out this Documentation, we will take you through the following:
* <a href="#Installation">Installation</a>
* <a href="#AppDocumentation">App Documentation</a>
* <a href="#Contribution">Contribution</a>

<h1 id="Installation">Installation</h1>
This project is built using the React Native framework thus the following steps must be followed help in the building og the application.

## Install React Native
1. Follow the instructions on the the <a>React Native</a> getting started guide to help with the installation of The React Native tools on your device
2. Clone the repository (including the Node Modules since they contain Project specific alterations that are vital to make sure the application runs)
3. `cd` into the project folder
4. Run any one of the following commands: <ul><li>`react-native run-android` - this allows running the application in developer mode allowing easy access to debugging features</li><li>`react-native run-android --variant=release` - this enables running the Application in a release mode variant (this is impportant esp when testing the performance of the application in a user environment)</li></ul>


<h1 id="AppDocumentation">App Documentation</h1>
This section will help take you through the basic app structure and what each screen(Activity) tries to achieve.

## Navigation Structure Overview
The Application uses <a>DrawerNavigation</a> to split the different routes relating to their grouping of activities they are supposed to achieve.
Main Drawer Sections:
<ol>
  <li><a href="#HomeSection">Home</a> - this section contains the Home Screen and mostly deals with parts that involve Route information and search for routes</li>
  <li><a href="#ReportSection">Report</a> - this is the section that takes the user through reporting dialogue to enable it to make it easier to report</li>
  <li><a href="#ViewReportsSection">View Reports</a> - this is the section that enables the User to see reports from the routes that they have set as 'favourites' and/or most used routes</li>
</ol>

<h2 id="HomeSection">Home Section</h2>
This Is the initial screen that is in place for viewing by the user once they interact with the application
This Section has several screens:
<ol>
  <li><a href="#HomeScreen">Home</a></li>
  <li><a href="#RouteDetailsScreen">RouteDetails</a></li>
  <li><a href="#ReportDetailsScreen">ReportDetails</a></li>
  <li><a href="#ReportCulpritScreen">ReportCulprit</a></li>
</ol>

<h3 id="HomeScreen">Home</h3>
This screen contains details about the Routes the user has <code>hearted</code> and would like to be readily available to them. This routes are presented in the form of <code>RouteCard</code>s that enable navigation to the <a href="RouteDetailsScreen">Route Details</a> for the specific route.
For more information on this screen, refer to the source code  located in the folder <code>screens/home</code>
<h3 id="RouteDetailsScreen">Route Details</h3>
This screen contains Information about the specific route. This is information such as:
<ol>
  <li>All reports pinned on the Map based on the location they were filed at</li>
  <li>All route stops associated with the specific route</li>
  <li>Graphical data that tries to present the data based on where the location of the incident was.</li>
</ol>
For more information, reference the source code of this screen from <code>screens/route_details</code>
<h3 id="ReportDetailsScreen">Report Details</h3>
This screen contains all the information on a report filed.
This includes:
<ol>
  <li>REPORT_ID</li>
  <li>Incident Decription - location, harrasment flags etc.</li>
  <li>Culprit Decription - Culprit type, sacco etc.</li>
  <li>Media attached to the report</li>
</ol>
For more information see implementation in the source code: <code>screens/report_details</code>
<h3 id="#ReportCulpritScreen">Report Culprit</h3>
This screen helps with the reporting of culprits that have been identified while viewing media attached to a file.<br />
See the folder <code>screens/report_culprit</code> for implementation details.

<h2 id="ReportSection">Report Section</h2>
This is the section that helps file a report while attaching media files, location and any other information. This section contains three main screens:
<ol>
  <li><a href="#ReportScreen">Report</a> - <code>NOT_IN_USE</code></li>
  <li><a href="#ReportV2">Report V2</a></li>
  <li><a href="#SetReminder">Add Vehicle Details</a></li>
  <li><a href="#AddVehicleDetails">Add Vehicle Details</a></li>
</ol>

<h3 id="ReportV2">Report V2</h3>
This is the screen used to aid the User in report a incident while aslo attaching relevant media.<br>
For more information on how this is achieved, see the folder <code>screens/report_v2</code>

<h2 id="ViewReportsSection">View Reports Section</h2>
This screen eables the viewing of reports from the routes the user has <code>hearted</code>.

All screens contained:<br/>
<ol>
  <li><a href="#AllReports">All Reports</a></li>
  <li><a href="#ReportDetails">Report details</a></li>
  <li><a href="#ReportCulprit">Report Culprit</a></li>
</ol>

<h3 id="AllReports">All Reports</h3>
Shows all the reports in form of a list enabling the user to interact with them.<br />
See <code>screens/all_reports</code> for more on the implementation

<h1 id="Contribution">Contribution</h1>
Perform a pull request and once authorised, all the changes made will be merged with the master branch and all changes updated to the application itself