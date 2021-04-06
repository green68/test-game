/*
Copyright (c) 2013 Suffick at Codepen (https://codepen.io/suffick), GitHub (https://github.com/suffick) and lonely-pixel.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

var Fn = {
    clone: function clone(obj) {
        if (obj == null || typeof (obj) != 'object')
            return obj;
        var temp = new obj.constructor();
        for (var key in obj)
            temp[key] = clone(obj[key]);
        return temp;
    }
};


/* Customisable map data */

var map = {

    tile_size: 16,

    /*
    
    Key vairables:
    
    id       [required] - an integer that corresponds with a tile in the data array.
    colour   [required] - any javascript compatible colour variable.
    solid    [optional] - whether the tile is solid or not, defaults to false.
    bounce   [optional] - how much velocity is preserved upon hitting the tile, 0.5 is half.
    jump     [optional] - whether the player can jump while over the tile, defaults to false.
    friction [optional] - friction of the tile, must have X and Y values (e.g {x:0.5, y:0.5}).
    gravity  [optional] - gravity of the tile, must have X and Y values (e.g {x:0.5, y:0.5}).
    fore     [optional] - whether the tile is drawn in front of the player, defaults to false.
    script   [optional] - refers to a script in the scripts section, executed if it is touched.
    
    */

    // you could use an associative array (map) to leverage named keys or a regular array to use numerical indexes
    keys: {
        0: { colour: '#333', solid: 0 },
        1: { colour: '#888', solid: 0 },
        'x': { colour: '#555', solid: 1, bounce: 0.35 },
        2: { colour: '#555', solid: 1, bounce: 0.35 },
        3: { colour: 'rgba(121, 220, 242, 0.4)', friction: { x: 0.9, y: 0.9 }, gravity: { x: 0, y: 0.1 }, jump: 1, fore: 1 },
        4: { id: 4, colour: '#777', jump: 1 },
        5: { id: 5, colour: '#E373FA', solid: 1, bounce: 1.1 },
        6: { id: 6, colour: '#666', solid: 1, bounce: 0 },
        7: { id: 7, colour: '#73C6FA', solid: 0, script: 'change_colour' },
        8: { id: 8, colour: '#FADF73', solid: 0, script: 'next_level' },
        9: { id: 9, colour: '#C93232', solid: 0, script: 'death' },
        10: { id: 10, colour: '#555', solid: 1 },
        11: { id: 11, colour: '#0FF', solid: 0, script: 'unlock' },
        12: { id: 12, colour: '#555', solid: 1 },
        13: { id: 13, colour: '#0FF', solid: 0, script: 'unlocktwo' },
        14: { id: 14, colour: 'rgba(121, 220, 242, 0.4)', friction: { x: 0.9, y: 0.9 }, gravity: { x: 0, y: 0.1 }, jump: 1, fore: 1 },
        // color cycler, current player color affects whether they can pass a cx_* block
        'cc': { id: 15, colour: '#FFF', solid: 0, script: 'cycle_colour', cycle_colour: ['#F00', '#00F', '#0F0'] },
        // color blocker -- only allow players of a certain color to pass
        'cx_F00': { id: 16, colour: '#666', alt_colour: '#888', solid: 0, script: 'colour_block', allow: '#F00' }
    },

    /* An array representing the map tiles. Each number/value corresponds to the index into the key array/map */
    data: [
        ['x', 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 'x', 'x', 'x', 'x'],
        ['x', 1, 1, 1, 'cx_F00', 1, 1, 1, 1, 'cc', 1, 1, 1, 1, 'cc', 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [2, 7, 2, 2, 2, 2, 10, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 9, 9, 9, 9, 9, 2, 1, 1, 1, 1, 1, 1, 2, 8, 2],
        [2, 1, 2, 1, 1, 3, 11, 1, 1, 1, 1, 9, 9, 9, 9, 2, 1, 2, 2, 2, 2, 1, 2, 1, 2],
        [2, 7, 2, 1, 1, 3, 12, 1, 1, 1, 1, 1, 9, 9, 9, 2, 1, 1, 1, 1, 2, 1, 2, 1, 2],
        [2, 1, 2, 3, 1, 3, 12, 1, 3, 1, 1, 1, 1, 9, 9, 9, 2, 1, 1, 1, 2, 1, 1, 1, 2],
        [2, 1, 2, 3, 1, 1, 12, 1, 1, 1, 1, 1, 1, 1, 9, 9, 9, 2, 2, 1, 1, 2, 2, 2, 2],
        [2, 7, 2, 3, 1, 3, 12, 9, 9, 9, 1, 1, 1, 1, 9, 9, 9, 9, 9, 1, 1, 2, 1, 1, 2],
        [2, 1, 2, 1, 1, 3, 12, 9, 9, 1, 1, 3, 1, 1, 1, 9, 9, 9, 9, 5, 1, 2, 1, 1, 2],
        [2, 1, 2, 3, 1, 3, 12, 9, 9, 9, 1, 3, 1, 1, 1, 9, 9, 9, 9, 9, 1, 1, 2, 1, 2],
        [2, 7, 2, 3, 1, 1, 12, 1, 1, 1, 9, 3, 1, 1, 1, 9, 9, 9, 9, 9, 1, 1, 2, 1, 2],
        [2, 1, 2, 3, 1, 3, 12, 1, 1, 1, 1, 9, 9, 1, 3, 9, 9, 9, 9, 9, 5, 1, 2, 2, 2],
        [2, 1, 2, 1, 1, 3, 12, 1, 2, 1, 1, 1, 9, 1, 3, 9, 9, 9, 9, 9, 9, 1, 1, 2, 2],
        [2, 7, 2, 3, 1, 3, 12, 1, 1, 2, 1, 1, 9, 1, 3, 9, 9, 9, 9, 9, 9, 1, 1, 2, 2],
        [2, 1, 2, 3, 1, 1, 12, 1, 1, 9, 2, 1, 9, 1, 3, 9, 9, 9, 9, 9, 9, 5, 1, 2, 2],
        [2, 1, 2, 3, 1, 3, 12, 2, 1, 9, 2, 1, 9, 1, 3, 9, 9, 9, 9, 9, 9, 9, 1, 1, 2],
        [2, 7, 2, 1, 1, 3, 12, 9, 1, 9, 2, 1, 9, 1, 3, 9, 9, 9, 9, 9, 9, 9, 1, 1, 2],
        [2, 1, 2, 3, 1, 3, 12, 1, 1, 1, 2, 1, 9, 1, 3, 9, 9, 9, 9, 9, 9, 9, 5, 3, 2],
        [2, 1, 2, 3, 1, 1, 12, 1, 3, 1, 2, 1, 9, 1, 3, 9, 9, 3, 3, 3, 9, 9, 9, 3, 2],
        [2, 7, 2, 3, 1, 3, 12, 1, 3, 1, 2, 1, 1, 1, 3, 9, 3, 3, 3, 3, 3, 9, 3, 3, 2],
        [2, 1, 2, 1, 1, 3, 12, 1, 9, 1, 2, 1, 1, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2],
        [2, 1, 2, 1, 1, 3, 12, 1, 1, 1, 1, 5, 2, 5, 3, 3, 3, 3, 9, 3, 3, 3, 3, 3, 9],
        [2, 1, 1, 1, 1, 1, 12, 1, 1, 1, 1, 1, 1, 13, 3, 3, 3, 9, 9, 9, 3, 3, 3, 9, 2],
        ['x', 'x', 'x', 2, 2, 2, 2, 5, 2, 5, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 9, 9, 9, 2, 2],
    ],

    /* Default gravity of the map */

    gravity: {
        x: 0,
        y: 0.3
    },

    /* Velocity limits */

    vel_limit: {
        x: 8,
        y: 16
    },

    /* Movement speed when the key is pressed */

    movement_speed: {
        jump: 4,
        left: .30,
        right: .30
    },

    /* The coordinates at which the player spawns and the colour of the player */

    player: {
        x: 23,
        y: 1,
        colour: '#FF9900'
    },

    /* scripts refered to by the "script" variable in the tile keys */

    scripts: {
        /* you can just use "this" instead of your engine variable ("game"), but Codepen doesn't like it */
        change_colour: function (game, tile, player) {
            player.colour = tile.alt_colour || "#" + (Math.random() * 0xFFFFFF << 0).toString(16);
        },
        cycle_colour: function (game, tile, player) {
            tile.cycle_colour_index = (!tile.cycle_colour_index || tile.cycle_colour_index >= tile.cycle_colour.length ? 1 : tile.cycle_colour_index + 1);
            player.colour = tile.cycle_colour[tile.cycle_colour_index - 1];
        },
        /* you could load a new map variable here */
        next_level: function (game, tile, player) {
            alert("Yay! You won! Reloading map.");
            // todo: get map by name to load next level
            game.load_map(game.current_map.next_level || map /*game.current_map*/);
        },
        death: function (game, tile, player) { alert("You died!"); game.reload_map(); },
        unlock: function (game, tile, player) { game.current_map.keys[10].solid = 0; game.current_map.keys[10].colour = "#888"; },
        unlocktwo: function (game, tile, player) { game.current_map.keys[12].solid = 0; game.current_map.keys[12].colour = "#888"; },
        unlockthree: function (game, tile, player) { game.current_map.keys[14].solid = 0; game.current_map.keys[14].colour = "#888"; game.current_map.keys[15].solid = 0; game.current_map.keys[15].colour = "#888"; game.current_map.keys[15].script = 0; }
        , colour_block: function (game, tile, player) {
            // hmm...this doesn't work very well here, needs to be in cycle_colour?
            // tile.solid = (tile.allow == player.colour) ? 0 : 1;

            // *NOTE* the following is kinda buggy...more of a hack onto the engine

            // then undo the movement that got them here
            if (tile.allow != player.colour) {
                // it's more complicated than this...
                this.player.loc.x -= this.player.vel.x;
                this.player.loc.y -= this.player.vel.y;

                // then stop their movement?
                this.player.vel.x = this.player.vel.y = 0;
                return false;
            }
        }
    }
};

/* Clarity engine */

var Clarity = function () {

    this.alert_errors = false;
    this.log_info = true;
    this.tile_size = 16;
    this.limit_viewport = false;
    this.jump_switch = 0;

    this.viewport = {
        x: 200,
        y: 200
    };

    this.camera = {
        x: 0,
        y: 0
    };

    this.key = {
        left: false,
        right: false,
        up: false
    };

    this.player = {

        loc: {
            x: 0,
            y: 0
        },

        vel: {
            x: 0,
            y: 0
        },

        can_jump: true
    };

    window.onkeydown = this.keydown.bind(this);
    window.onkeyup = this.keyup.bind(this);
};

Clarity.prototype.error = function (message) {

    if (this.alert_errors) alert(message);
    if (this.log_info) console.log(message);
};

Clarity.prototype.log = function (message) {

    if (this.log_info) console.log(message);
};

Clarity.prototype.set_viewport = function (x, y) {

    this.viewport.x = x;
    this.viewport.y = y;
};

Clarity.prototype.keydown = function (e) {

    var _this = this;

    switch (e.keyCode) {
        case 37:
            _this.key.left = true;
            break;
        case 38:
            _this.key.up = true;
            break;
        case 39:
            _this.key.right = true;
            break;
    }
};

Clarity.prototype.keyup = function (e) {

    var _this = this;

    switch (e.keyCode) {
        case 37:
            _this.key.left = false;
            break;
        case 38:
            _this.key.up = false;
            break;
        case 39:
            _this.key.right = false;
            break;
    }
};

Clarity.prototype.reload_map = function () {
    this.load_map(this.original_map);
}

Clarity.prototype.load_map = function (map) {

    if (typeof map === 'undefined'
        || typeof map.data === 'undefined'
        || typeof map.keys === 'undefined') {

        this.error('Error: Invalid map data!');

        return false;
    }

    this.current_map = map;
    this.original_map = Fn.clone(map);

    this.current_map.background = map.background || '#333';
    this.current_map.gravity = map.gravity || { x: 0, y: 0.3 };
    this.tile_size = map.tile_size || 16;

    var _this = this;

    this.current_map.width = 0;
    this.current_map.height = 0;

    map.data.forEach(function (row, y) {

        _this.current_map.height = Math.max(_this.current_map.height, y);

        row.forEach(function (tile, x) {

            _this.current_map.width = Math.max(_this.current_map.width, x);

            _this.current_map.data[y][x] = map.keys[tile];
        });
    });

    this.current_map.width_p = this.current_map.width * this.tile_size;
    this.current_map.height_p = this.current_map.height * this.tile_size;

    this.player.loc.x = map.player.x * this.tile_size || 0;
    this.player.loc.y = map.player.y * this.tile_size || 0;
    this.player.colour = map.player.colour || '#000';

    this.camera = {
        x: 0,
        y: 0
    };

    this.player.vel = {
        x: 0,
        y: 0
    };

    this.log('Successfully loaded map data.');

    return true;
};

Clarity.prototype.get_tile = function (x, y) {

    return (this.current_map.data[y] && this.current_map.data[y][x]) ? this.current_map.data[y][x] : 0;
};

Clarity.prototype.draw_tile = function (x, y, tile, context) {

    if (!tile || !tile.colour) return;

    context.fillStyle = tile.colour;
    context.fillRect(
        x,
        y,
        this.tile_size,
        this.tile_size
    );
};

Clarity.prototype.draw_map = function (context, fore) {

    for (var y = 0; y < this.current_map.data.length; y++) {

        for (var x = 0; x < this.current_map.data[y].length; x++) {

            if ((!fore && !this.current_map.data[y][x].fore) || (fore && this.current_map.data[y][x].fore)) {

                var t_x = (x * this.tile_size) - this.camera.x;
                var t_y = (y * this.tile_size) - this.camera.y;

                if (t_x < -this.tile_size
                    || t_y < -this.tile_size
                    || t_x > this.viewport.x
                    || t_y > this.viewport.y) continue;

                this.draw_tile(
                    t_x,
                    t_y,
                    this.current_map.data[y][x],
                    context
                );
            }
        }
    }

    if (!fore) this.draw_map(context, true);
};

Clarity.prototype.move_player = function () {

    var tX = this.player.loc.x + this.player.vel.x;
    var tY = this.player.loc.y + this.player.vel.y;

    var offset = Math.round((this.tile_size / 2) - 1);

    var tile = this.get_tile(
        Math.round(this.player.loc.x / this.tile_size),
        Math.round(this.player.loc.y / this.tile_size)
    );

    // run script early for 'prevention' effects, etc
    if (this.last_tile != tile.id && tile.script) {
        // optionally break out of movement?
        if (false === this.current_map.scripts[tile.script].call(this, game, tile, this.player)) return;
    }


    if (tile.gravity) {

        this.player.vel.x += tile.gravity.x;
        this.player.vel.y += tile.gravity.y;

    } else {

        this.player.vel.x += this.current_map.gravity.x;
        this.player.vel.y += this.current_map.gravity.y;
    }

    if (tile.friction) {

        this.player.vel.x *= tile.friction.x;
        this.player.vel.y *= tile.friction.y;
    }

    var t_y_up = Math.floor(tY / this.tile_size);
    var t_y_down = Math.ceil(tY / this.tile_size);
    var y_near1 = Math.round((this.player.loc.y - offset) / this.tile_size);
    var y_near2 = Math.round((this.player.loc.y + offset) / this.tile_size);

    var t_x_left = Math.floor(tX / this.tile_size);
    var t_x_right = Math.ceil(tX / this.tile_size);
    var x_near1 = Math.round((this.player.loc.x - offset) / this.tile_size);
    var x_near2 = Math.round((this.player.loc.x + offset) / this.tile_size);

    var top1 = this.get_tile(x_near1, t_y_up);
    var top2 = this.get_tile(x_near2, t_y_up);
    var bottom1 = this.get_tile(x_near1, t_y_down);
    var bottom2 = this.get_tile(x_near2, t_y_down);
    var left1 = this.get_tile(t_x_left, y_near1);
    var left2 = this.get_tile(t_x_left, y_near2);
    var right1 = this.get_tile(t_x_right, y_near1);
    var right2 = this.get_tile(t_x_right, y_near2);


    if (tile.jump && this.jump_switch > 15) {

        this.player.can_jump = true;

        this.jump_switch = 0;

    } else this.jump_switch++;

    this.player.vel.x = Math.min(Math.max(this.player.vel.x, -this.current_map.vel_limit.x), this.current_map.vel_limit.x);
    this.player.vel.y = Math.min(Math.max(this.player.vel.y, -this.current_map.vel_limit.y), this.current_map.vel_limit.y);

    this.player.loc.x += this.player.vel.x;
    this.player.loc.y += this.player.vel.y;

    this.player.vel.x *= .9;

    if (left1.solid || left2.solid || right1.solid || right2.solid) {

        /* fix overlap */

        while (this.get_tile(Math.floor(this.player.loc.x / this.tile_size), y_near1).solid
            || this.get_tile(Math.floor(this.player.loc.x / this.tile_size), y_near2).solid)
            this.player.loc.x += 0.1;

        while (this.get_tile(Math.ceil(this.player.loc.x / this.tile_size), y_near1).solid
            || this.get_tile(Math.ceil(this.player.loc.x / this.tile_size), y_near2).solid)
            this.player.loc.x -= 0.1;

        /* tile bounce */

        var bounce = 0;

        if (left1.solid && left1.bounce > bounce) bounce = left1.bounce;
        if (left2.solid && left2.bounce > bounce) bounce = left2.bounce;
        if (right1.solid && right1.bounce > bounce) bounce = right1.bounce;
        if (right2.solid && right2.bounce > bounce) bounce = right2.bounce;

        this.player.vel.x *= -bounce || 0;

    }

    if (top1.solid || top2.solid || bottom1.solid || bottom2.solid) {

        /* fix overlap */

        while (this.get_tile(x_near1, Math.floor(this.player.loc.y / this.tile_size)).solid
            || this.get_tile(x_near2, Math.floor(this.player.loc.y / this.tile_size)).solid)
            this.player.loc.y += 0.1;

        while (this.get_tile(x_near1, Math.ceil(this.player.loc.y / this.tile_size)).solid
            || this.get_tile(x_near2, Math.ceil(this.player.loc.y / this.tile_size)).solid)
            this.player.loc.y -= 0.1;

        /* tile bounce */

        var bounce = 0;

        if (top1.solid && top1.bounce > bounce) bounce = top1.bounce;
        if (top2.solid && top2.bounce > bounce) bounce = top2.bounce;
        if (bottom1.solid && bottom1.bounce > bounce) bounce = bottom1.bounce;
        if (bottom2.solid && bottom2.bounce > bounce) bounce = bottom2.bounce;

        this.player.vel.y *= -bounce || 0;

        if ((bottom1.solid || bottom2.solid) && !tile.jump) {

            this.player.on_floor = true;
            this.player.can_jump = true;
        }

    }

    // adjust camera

    var c_x = Math.round(this.player.loc.x - this.viewport.x / 2);
    var c_y = Math.round(this.player.loc.y - this.viewport.y / 2);
    var x_dif = Math.abs(c_x - this.camera.x);
    var y_dif = Math.abs(c_y - this.camera.y);

    if (x_dif > 5) {

        var mag = Math.round(Math.max(1, x_dif * 0.1));

        if (c_x != this.camera.x) {

            this.camera.x += c_x > this.camera.x ? mag : -mag;

            if (this.limit_viewport) {

                this.camera.x =
                    Math.min(
                        this.current_map.width_p - this.viewport.x + this.tile_size,
                        this.camera.x
                    );

                this.camera.x =
                    Math.max(
                        0,
                        this.camera.x
                    );
            }
        }
    }

    if (y_dif > 5) {

        var mag = Math.round(Math.max(1, y_dif * 0.1));

        if (c_y != this.camera.y) {

            this.camera.y += c_y > this.camera.y ? mag : -mag;

            if (this.limit_viewport) {

                this.camera.y =
                    Math.min(
                        this.current_map.height_p - this.viewport.y + this.tile_size,
                        this.camera.y
                    );

                this.camera.y =
                    Math.max(
                        0,
                        this.camera.y
                    );
            }
        }
    }

    this.last_tile = tile.id;
};

Clarity.prototype.update_player = function () {

    if (this.key.left) {

        if (this.player.vel.x > -this.current_map.vel_limit.x)
            this.player.vel.x -= this.current_map.movement_speed.left;
    }

    if (this.key.up) {

        if (this.player.can_jump && this.player.vel.y > -this.current_map.vel_limit.y) {

            this.player.vel.y -= this.current_map.movement_speed.jump;
            this.player.can_jump = false;
        }
    }

    if (this.key.right) {

        if (this.player.vel.x < this.current_map.vel_limit.x)
            this.player.vel.x += this.current_map.movement_speed.left;
    }

    this.move_player();
};

Clarity.prototype.draw_player = function (context) {

    context.fillStyle = this.player.colour;

    context.beginPath();

    context.arc(
        this.player.loc.x + this.tile_size / 2 - this.camera.x,
        this.player.loc.y + this.tile_size / 2 - this.camera.y,
        this.tile_size / 2 - 1,
        0,
        Math.PI * 2
    );

    context.fill();
};

Clarity.prototype.update = function () {

    this.update_player();
};

Clarity.prototype.draw = function (context) {

    this.draw_map(context, false);
    this.draw_player(context);
};

/* Setup of the engine */

window.requestAnimFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
        return window.setTimeout(callback, 1000 / 60);
    };

var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 400;

var game = new Clarity();
game.set_viewport(canvas.width, canvas.height);
game.load_map(map);

/* Limit the viewport to the confines of the map */
game.limit_viewport = true;

var Loop = function () {

    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    game.update();
    game.draw(ctx);

    window.requestAnimFrame(Loop);
};

Loop();