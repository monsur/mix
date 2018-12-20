(function() {
  var frontCover = 'front.jpg';
  var backCover = 'back.jpg';
  var playIcon = '../images/play.png';
  var pauseIcon = '../images/pause.png';

  var Player = function(tracks) {
    this.tracks = tracks;
    this.currentTrackId = 0;
    this.htmlPlayer = document.getElementById('audioplayer');
    var that = this;
    this.htmlPlayer.addEventListener('error', function() {
      document.getElementById('playaction').src = playIcon;
      if (!that.htmlPlayer.paused) {
        that.htmlPlayer.pause();
      }
    });
    this.htmlPlayer.addEventListener('ended', function() {
      if (that.currentTrackId == that.tracks.length - 1) {
        document.getElementById('playaction').src = playIcon;
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
    document.getElementById('title').innerHTML = track.title;
    document.getElementById('artist').innerHTML = track.artist;
    var nextTrackText = '&nbsp;';
    if (++pos < this.tracks.length) {
      var nextTrack = this.tracks[pos];
      nextTrackText = 'Next: ' + nextTrack.title + ' - ' + nextTrack.artist;
    }
    document.getElementById('nexttrack').innerHTML = nextTrackText;
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
      document.getElementById('albumartback').style.display = 'none';
    } else {
      document.getElementById('albumartback').style.display = 'block';
      document.getElementById('albumartfrontimg').src = frontCover;
    }
    $('#albumart').css('margin-top', marginTop + 'px');
    $('.albumart').width(imgWidth + 'px');
    $('.albumart').height(imgWidth + 'px');
    $('#content').width(contentWidth + 'px');
  };

  var player = new Player(_DATA.tracks);

  $(function() {
    var downloadLink = _DATA.title + '.zip';
    document.title = _DATA.title;
    $('body').css('background-color', _DATA.backgroundColor);
    document.getElementById('albumartfrontimg').src = frontCover;
    document.getElementById('albumartfrontimg').alt = _DATA.title;
    document.getElementById('albumartbackimg').src = backCover;
    document.getElementById('albumartbackimg').alt = _DATA.title;
    document.getElementById('downloadLink').href = downloadLink;
    document.getElementById('spotifyLink').href = _DATA.spotify;
    document.getElementById('audioplayer').src = _DATA.tracks[0].src;
    document.getElementById('title').innerHTML = _DATA.tracks[0].title;
    document.getElementById('artist').innerHTML = _DATA.tracks[0].artist;
    document.getElementById('nexttrack').innerHTML = 'Next: ' + 
        _DATA.tracks[1].artist + ' - ' + _DATA.tracks[1].title;

    resize();

    $(window).resize(resize);

    $('#downloadLink').click(function(evt) {
      track('download', 1);
    });

    document.getElementById('albumart').style.display = 'block';
    $('#albumart').on('click', function(evt) {
      if (mode != 'small') {
        return;
      }
      var newImg = frontCover;
      if (document.getElementById('albumartfrontimg').src.toLowerCase().indexOf(frontCover) >= 0) {
        newImg = backCover;
      }
      document.getElementById('albumartfrontimg').src = newImg;
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

