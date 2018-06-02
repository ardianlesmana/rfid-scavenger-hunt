$(function() {
  var socket = io('http://192.168.1.197:3000');
  var leaderboardSocket = io('http://34.229.16.191:8000');

  localStorage.setItem('claimed', JSON.stringify([]));

  socket.on('item-added', function(data){
    var claimed = JSON.parse(localStorage.getItem('claimed'));
    var itemId = data;
    var ts = new Date();

    console.log(claimed.indexOf(itemId));

    if(claimed.indexOf(itemId) >= 0) {
      $('#loggingTA').append(
          ts.toISOString() + ' - ' + 'Item is already been claimed before (' + itemId + ')\n'
          );
    } else {
      $('#loggingTA').append(
          ts.toISOString() + ' - ' + 'An item has been scanned (' + itemId + ')\n'
          );
    }
  });

  socket.on('item-already-added', function(data){
    var ts = new Date();
    $('#loggingTA').append(
        ts.toISOString() + ' - ' + "Item has already been added (" + JSON.stringify(data) + ")\n"
        );
  });

  socket.on('dud-added', function(data){
    var ts = new Date();
    $('#loggingTA').append(
        ts.toISOString() + ' - ' + "God almighty! You found the dud (" + JSON.stringify(data) + ")\n"
        );
  });

  socket.on('user-submit', function(data){
    var claimed = JSON.parse(localStorage.getItem('claimed'));
    var validItems = [];
    for (let item of data.items) {
      if(claimed.indexOf(item) == -1) {
        validItems.push(item);
      }
    }
    var payload = {
      tagId: data.tag_uid,
      result: {
        game: 'scavenger-hunt',
        score: validItems.length
      }
    }
    leaderboardSocket.emit('SCORES_CHANGE', payload);

    localStorage.setItem('claimed', JSON.stringify(claimed.concat(validItems)));

    var ts = new Date();
    $('#loggingTA').append(
        ts.toISOString() + ' - ' + 'User ' + data.tag_uid + ' has successfully submitted ' +
        validItems.length + ' valid items and ' + data.duds.length + ' duds \n'
        );
  });
});
