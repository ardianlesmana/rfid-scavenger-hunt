$(function() {
  var socket = io('http://192.168.1.197:3000');
  var leaderboardSocket = io('http://192.168.1.197:3000');

  socket.on('item-added', function(data){
    var ts = new Date();
    $('#loggingTA').append(
        ts.toISOString() + ' - ' + 'An item has been scanned (' + JSON.stringify(data) + ')\n'
        );
  });

  socket.on('dud-added', function(data){
    var ts = new Date();
    $('#loggingTA').append(
        ts.toISOString() + ' - ' + "God almighty! You found the dud (" + JSON.stringify(data) + ")\n"
        );
  });

  socket.on('user-submit', function(data){
    var ts = new Date();
    $('#loggingTA').append(
        ts.toISOString() + ' - ' + 'User ' + data.tag_uid + ' has successfully submitted ' +
        data.items.length + ' items and ' + data.duds.length + ' duds \n'
        );
  });
});
