/**
 * Generates a login activity report for the last week as a spreadsheet. The
 * report includes the time, user, and login result.
 */
function generateLoginActivityReport() {
  var spreadsheet = SpreadsheetApp.openByUrl('<INSERT YOUR GOOGLE SHEET HERE');
 var sheet = spreadsheet.getActiveSheet();
  var rows = [];
  var pageToken;
  var page;
  
  
  //Pull only a week at a time
  
    var now = new Date();
  var oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  var startTime = oneWeekAgo.toISOString();
  var endTime = now.toISOString();
  
  
  do {
    page = AdminReports.Activities.list('all', 'admin', {
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
          new Date(item.id.time),
          item.actor.email,
          //item.events[0].eventType,
         //item.events[0].name,
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
    var headers = ['Time', 'User', 'Login Result'];
    sheet.appendRow(headers);

    // Append the results.
    sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);

    Logger.log('Report spreadsheet created: %s', spreadsheet.getUrl());
  } else {
    Logger.log('No results returned.');
  }
}
