This works if you don't want to use GAM or Graylog.

/**
 * Generates a login activity report for the last week as a spreadsheet. The
 * report includes the time, user, and login result.
 */
function generateLoginActivityReport() {
  var spreadsheet = SpreadsheetApp.openByUrl('<Insert your spreadsheet link here>');
 var sheet = spreadsheet.getActiveSheet();
  var rows = [];
  var pageToken;
  var page;
  var userKey = 'user@domain';
  var applicationName = 'admin';
  
  //Pull only a week at a time
  
    var now = new Date();
  //var oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  var oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  var startTime = oneHourAgo.toISOString();
  var endTime = now.toISOString();
  
  
  do {
    page = AdminReports.Activities.list(userKey, applicationName, {
    startTime: startTime,
    endTime: endTime,
      maxResults: 700,
      pageToken: pageToken
    });
    
   
    var items = page.items;
    if (items) {
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var row = [
        //Append Date
          new Date(item.id.time),
        //Append User who Did it 
          item.actor.email,
        //Pulls the event name
         item.events[0].name,
        //Pulls the event type
         item.events[0].eventType,
        //Detailed log string can't pull full api with this though
          item.events[0].parameters.toString(0),
          ];
        sheet.appendRow(row);
        //  rows.push(row);
      }
    }
    pageToken = page.nextPageToken;
  } while (pageToken);

  if (rows.length > 0) {
;

    // Append the headers.
    var headers = ['Time', 'User', 'Event Name', 'Event Type', 'Log Result'];
    sheet.appendRow(headers);

    // Append the results.
    sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);

    Logger.log('Report spreadsheet created: %s', spreadsheet.getUrl());
  } else {
    Logger.log('No results returned.');
  }
}
