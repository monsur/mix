(function() {
  var frontCover = 'front.jpg';
  var backCover = 'back.jpg';

  var tracks = _DATA.tracks;

  var Player = function(tracks) {
    this.tracks = tracks;
    this.currentTrackId = 0;
    this.htmlPlayer = $('#audioplayer')[0];
    var that = this;
    this.htmlPlayer.addEventListener('error', function() {
      $('#playaction')[0].src = playIcon;
      if (!that.htmlPlayer.paused) {
        that.htmlPlayer.pause();
      }
    });
    this.htmlPlayer.addEventListener('ended', function() {
      if (that.currentTrackId == that.tracks.length - 1) {
        $('#playaction')[0].src = playIcon;
        that.currentTrackId = 0;
        that.setCurrentSrc(0, false);
        return;
      }
      that.nextTrack(true);
    });
    this.setCurrentSrc(this.currentTrackId);
  };

  Player.prototype.setCurrentSrc = function(pos, keepPlaying) {
    var isPlaying = keepPlaying || !this.htmlPlayer.paused;
    var track = this.tracks[pos];
    this.htmlPlayer.src = track.src;
    this.htmlPlayer.load();
    if (isPlaying) {
      this.htmlPlayer.play();
    }
    $('#title').text(track.title);
    $('#artist').text(track.artist);
    var nextTrackText = '&nbsp;';
    if (++pos < this.tracks.length) {
      var nextTrack = this.tracks[pos];
      nextTrackText = 'Next: ' + nextTrack.title + ' - ' + nextTrack.artist;
    }
    $('#nexttrack').html(nextTrackText);
  };

  Player.prototype.togglePlay = function(callback) {
    if (this.htmlPlayer.paused) {
      this.htmlPlayer.play();
      track('play', this.currentTrackId);
    } else {
      this.htmlPlayer.pause();
      track('pause', this.currentTrackId);
    }
    if (callback) {
      callback.call(null, !this.htmlPlayer.paused);
    }
  };

  Player.prototype.nextTrack = function(keepPlaying, callback) {
    if (this.currentTrackId == this.tracks.length - 1) {
      return;
    }
    this.currentTrackId++;
    this.setCurrentSrc(this.currentTrackId, keepPlaying);
    track('next', this.currentTrackId);
  };

  Player.prototype.previousTrack = function(keepPlaying, callback) {
    if (this.currentTrackId === 0) {
      return;
    }
    this.currentTrackId--;
    this.setCurrentSrc(this.currentTrackId, keepPlaying);
    track('prev', this.currentTrackId);
  };

  var track = function(label, count) {
    count = count || 0;
    if (window.ga) {
      ga('send', 'event', label, 'click', 'player', count);
    }
  };


  var mode = 'large';
  var resize = function() {
    var imgWidth, contentWidth, marginTop;
    var viewportWidth = $(window).width();
    if (viewportWidth <= 505) {
      mode = 'small';
      contentWidth = viewportWidth;
      imgWidth = contentWidth;
      marginTop = 0;
    } else if (viewportWidth <= 900) {
      mode = 'medium';
      contentWidth = viewportWidth;
      imgWidth = contentWidth/2;
      marginTop = 60;
    } else {
      mode = 'large';
      contentWidth = 900;
      imgWidth = contentWidth/2;
      marginTop = 60;
    }
    if (mode == 'small') {
      $('#albumartback').hide();
    } else {
      $('#albumartback').show();
      $('#albumartfrontimg')[0].src = frontCover;
    }
    $('#albumart').css('margin-top', marginTop + 'px');
    $('.albumart').width(imgWidth + 'px');
    $('.albumart').height(imgWidth + 'px');
    $('#content').width(contentWidth + 'px');
  };

  var player = new Player(tracks);
  var playIcon = '../images/play.png';
  var pauseIcon = '../images/pause.png';

  $(function() {
    var downloadLink = _DATA.title + '.zip';
    document.title = _DATA.title;
    $('body').css('background-color', _DATA.backgroundColor);
    $('#albumartfrontimg').attr('src', frontCover)
        .attr('alt', _DATA.title);
    $('#albumartbackimg').attr('src', backCover)
        .attr('alt', _DATA.title);
    $('#downloadLink').attr('href', downloadLink);
    $('#spotifyLink').attr('href', _DATA.spotify);
    $('#audioplayer').attr('src', _DATA.tracks[0].src);
    $('title').text(_DATA.tracks[0].title);
    $('artist').text(_DATA.tracks[0].artist);
    $('nexttrack').text("Next: " + _DATA.tracks[1].artist + ' - ' +
      _DATA.tracks[1].title);

    resize();

    $(window).resize(resize);

    $('#downloadLink').click(function(evt) {
      track('download', 1);
    });

    $('#albumart').show();
    $('#albumart').on('click', function(evt) {
      if (mode != 'small') {
        return;
      }
      var newImg = frontCover;
      if ($('#albumartfrontimg')[0].src.toLowerCase().indexOf(frontCover) >= 0) {
        newImg = backCover;
      }
      $('#albumartfrontimg')[0].src = newImg;
    });

    $('#playaction').click(function(evt) {
      player.togglePlay(function(isPlaying) {
        var img = playIcon;
        if (isPlaying) {
          img = pauseIcon;
        }
        evt.target.src = img;
      });
    });
    $('#prevaction').click(function() { player.previousTrack(); });
    $('#nextaction').click(function() { player.nextTrack(); });
  });
})();

