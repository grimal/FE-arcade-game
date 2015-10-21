// This is the player menu object.
var Menu = function(items) {
  "use strict";
  this.selectedItem = 0;
  this.selectionChange = false;
  this.collision = false;
  this.fade = false;
  this.fade_d = null;
  this.alpha = 0;
  this.items = items;
  this.one = [140, 410, 36, 'white'];
  this.two = [305, 410, 36, 'white'];
  this.show = false;
  this.menuctx = null;
  this.mousePos = {
        x: 0,
        y: 0
    };
  //this.mousePos.hitbox = new Hitbox(0,0,1,1);
  var boyAvatar = new Avatar(125, 200, items[1], 'images/char-boy.png');
  var girlAvatar = new Avatar(275, 200, items[2], 'images/char-cat-girl.png');
  this.allAvatars = [];
  this.allAvatars.push(boyAvatar);
  this.allAvatars.push(girlAvatar);
};

//  Called to initiate the Menu.  Creates the additional canvas and appends it to document.
Menu.prototype.init = function() {
    "use strict";
    var canvas = document.createElement('canvas');
    canvas.id = "MenuLayer";
    canvas.width = 505;
    canvas.height = 606;
    canvas.style.zIndex = 8;
    canvas.style.position = "absolute";
    canvas.style.border = "1px solid";

    var body = document.getElementsByTagName("body")[0];
    body.appendChild(canvas);
};

// This is called after init method.  This only happens right when the menu switches to show.
Menu.prototype.refresh = function() {
  "use strict";
  var canvas = document.getElementById('MenuLayer');
  menu.menuctx = canvas.getContext("2d");

  // Add event listeners for mouse move and click

  canvas.addEventListener('mousemove', function(evt) {
    menu.mousePos = getMousePos(canvas, evt);
    menu.mousePos.hitbox = new Hitbox(0,0,1,1);
  }, false);

  canvas.addEventListener('click', function(evt) {
    if (menu.selectedItem !== 0) {
      switch (menu.selectedItem) {
        case 1:
          menu.fade = true;
          menu.fade_d = 0;
          break;
        case 2:
          menu.fade = true;
          menu.fade_d = 0;
          break;
        default:
          break;
        }
    }
  }, false);

  this.draw();

};
// This draws the menu, fills in the background, and places the "Choose Player" text.
Menu.prototype.draw = function() {  
    "use strict";
    menu.menuctx.globalAlpha = menu.alpha;
    var lingrad = menu.menuctx.createLinearGradient(100, 150, 300, 300);

    lingrad.addColorStop(0, '#0B3B0B');
    lingrad.addColorStop(1, '#99FF99');

    menu.menuctx.fillStyle = lingrad;
    menu.menuctx.fillRect(100, 150, 300, 300);

    menu.menuctx.font = "36px Times New Roman";
    menu.menuctx.strokeStyle = "black";
    menu.menuctx.lineWidth = 3;
  
    menu.menuctx.fillStyle = "white";

    //  Write the text 'choose Player'
    menu.menuctx.font = '36px Times New Roman';
    menu.menuctx.fillStyle = 'white';

    menu.menuctx.strokeText(this.items[0], 150, 180);
    menu.menuctx.fillText(this.items[0], 150, 180);

};

// Renders the text for the players.
 Menu.prototype.render = function() {
  "use strict";
  menu.menuctx.font = this.one[2] + 'px Times New Roman';
  menu.menuctx.fillStyle = this.one[3];
  menu.menuctx.strokeText(this.items[1], this.one[0], this.one[1]);
  menu.menuctx.fillText(this.items[1], this.one[0], this.one[1]);

  menu.menuctx.font = this.two[2] + 'px Times New Roman';
  menu.menuctx.fillStyle = this.two[3];
  menu.menuctx.strokeText(this.items[2], this.two[0], this.two[1]);
  menu.menuctx.fillText(this.items[2], this.two[0], this.two[1]);
};

// Update function that sets the fade of the menu and determines the display text based on the
// mouse position on the screen.
  Menu.prototype.update = function(dt) {
    "use strict";
    if (this.fade) {
      if (this.fade_d === 1) {
        this.alpha += (dt * 5);
        if (this.alpha > 1) {
          this.alpha = 1;
          menu.menuctx.alpha = 1;
          this.fade = false;
          this.fade_d = null;
        }
      } else if (this.fade_d === 0) {

        this.alpha -= (dt * 5);
        if (this.alpha < 0) {
          this.alpha = 0;
          menu.menuctx.alpha = 0;
          this.fade = false;
          this.fade_d = null;
          menu.close();
        }
      }

    }
    switch (menu.selectedItem) {
      case 0:
        menu.one[0] = 140;
        menu.one[2] = 36;      
        menu.one[3] = 'white';
        menu.two[0] = 305;
        menu.two[2] = 36;
        menu.two[3] = 'white';
        break;
      case 1:
        menu.one[0] = 130;
        menu.one[2] = 48;
        menu.one[3] = 'yellow';
        menu.two[0] = 305;
        menu.two[2] = 36;
        menu.two[3] = 'white';
        break;
      case 2:
        menu.two[0] = 295;
        menu.two[2] = 48;
        menu.two[3] = 'yellow';
        menu.one[0] = 140;
        menu.one[2] = 36;
        menu.one[3] = 'white';
        break;
      default:
        break;

    }

    menu.collision = false;
};

// This closes the menu and removes the listeners.
Menu.prototype.close = function() {
  "use strict";

  menu.show = false;
  menu.menuctx.clearRect(100, 150, 300, 300);

  var canvas = document.getElementById('MenuLayer');
  
  canvas.removeEventListener('mousemove', function(evt) {
      menu.mousePos = getMousePos(canvas, evt);
    }, false);


  canvas.removeEventListener('click', function(evt) {
    if (menu.selectedItem !== 0) {
      switch (menu.selectedItem) {
        case 1:
          menu.fade = true;
          menu.fade_d = 0;
          break;
        case 2: 
          menu.fade = true;
          menu.fade_d = 0;
          break;
        default:
          break;
        }
    }
  }, false);

  var body = document.getElementsByTagName("body")[0];
  body.removeChild(canvas);
  menu.menuctx = null;

  world.gameStart(this.selectedItem);
};

// This is only called if the mouse is detected to reside over one of the avatars.
Menu.prototype.avatarHover = function (name, collide) {
  "use strict";
  menu.collision = true;

    switch (name) {
       case 'Jack':
        if (menu.selectedItem != 1) {
          menu.selectedItem = 1;
          menu.selectionChange = true;
        }
        break;
       case 'Jill': 
        if (menu.selectedItem != 2) {
          menu.selectedItem = 2;
          menu.selectionChange = true;
        } 
        break;
      default:
        break;
     
    } 

  if (menu.selectionChange) {
    menu.selectionChange = false;
  }
  
};

// Additional update function that clears the canvas and resets the selection to 0 if no
// avatar is being hovered over.
Menu.prototype.cycle = function(dt) {
  "use strict";
  if (!menu.collision) {
    this.selectedItem = 0;
    menu.selectionChange = true;
  }

  menu.menuctx.clearRect(100, 150, 300, 300);
  menu.draw();
  menu.render();
  menu.update(dt);
};

// Self explanatory.
function getMousePos(canvas, evt) {
  "use strict";
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

// Avatar object.  This is the characters for the selection screen.
var Avatar = function(x, y, name, sprite) {
    "use strict";
    this.x = x;
    this.y = y;
    this.height = 171;
    this.width = 101;
    this.name = name;
    this.sprite = sprite;
    this.hitbox = new Hitbox(17,63,67,156);

};

// Renders the avatar (and hitbox if enabled).
Avatar.prototype.render = function() {
    "use strict";
    menu.menuctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.height);
    if (hitboxEnabled) {
        menu.menuctx.strokeStyle = "red";
        menu.menuctx.strokeRect(this.x + this.hitbox.x, this.y + this.hitbox.y, this.hitbox.width, this.hitbox.height);
        menu.menuctx.strokeStyle = "black";
    }
};