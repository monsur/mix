function CoverType(name, imgsrc) {
  this._name = name;
  this.Image = new Image();
  this.Image.src = imgsrc;
}


CoverType.prototype.toString = function () {
  return this._name;
};


CoverType.FRONT = new CoverType('front', 'oh_seven_front.jpg');
CoverType.BACK = new CoverType('back', 'oh_seven_back.jpg');


function OhSeven() {
  this.currentCover = CoverType.FRONT;
};


OhSeven.prototype.toggleCover = function() {
  var newCover = CoverType.BACK;
  if (this.currentCover == CoverType.BACK) {
    newCover = CoverType.FRONT;
  }
  this.showCover(newCover);
};


OhSeven.prototype.showFrontCover = function() {
  this.showCover(CoverType.FRONT);
};


OhSeven.prototype.showBackCover = function() {
  this.showCover(CoverType.BACK);
};


OhSeven.prototype.showCover = function(coverType) {
  this.showCover_(coverType.Image.src);
  this.currentCover = coverType;
};


OhSeven.prototype.showCover_ = function(img) {
  document.getElementById('coverimg').src = img;
};


var ohseven = new OhSeven();
