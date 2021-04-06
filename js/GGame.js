/*
Copyright (c) 2013 Suffick at Codepen (https://codepen.io/dissimulate/pen/CqIxk) and GitHub (https://github.com/dissimulate/Clarity)

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

import { clone, importModule } from "./utils.js";
import { Editor } from "./Editor.js";

class GGame {
    constructor() {

        this.debug = false;

        this.alert_errors = false;
        this.log_info = true;
        this.tile_size = 16;
        this.limit_viewport = false;
        this.jump_switch = 0;
        this.current_map = {};
        this.last_map = {};

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
            up: false,
            down: false
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

        window.addEventListener('keydown', this.keydown.bind(this))
        window.addEventListener('keyup', this.keyup.bind(this))
        // window.onkeyup = this.keyup.bind(this);
    }
    error(message) {

        if (this.alert_errors)
            alert(message);
        if (this.log_info)
            console.log(message);
    }
    log(message) {

        if (this.log_info)
            console.log(message);
    }
    /**
     *
     * @param {string} message the name(id) of current_map.messages
     * @param {function} callback the function to call after message validate
     */
    message(message, callback) {
        this.state = "message";
        if (typeof callback === "function")
            this.callback = callback;
        if (this.infosBox) {
            this.infosMessage.innerHTML = this.current_map.messages[message];
        }
        else {
            alert(message);
            this.state = 'callback';
        }
    }
    /**
     *
     * @param {number} x
     * @param {number} y
     */
    set_viewport(x, y) {

        this.viewport.x = x;
        this.viewport.y = y;
    }
    /**
     *
     * @param {event} e
     */
    keydown(e) {

        var _this = this;

        // switch (e.keyCode) {
        //     case 37:
        //         _this.key.left = true;
        //         break;
        //     case 38:
        //         _this.key.up = true;
        //         break;
        //     case 39:
        //         _this.key.right = true;
        //         break;
        //     case 40:
        //         _this.key.down = true;
        //         break;
        //     case 69:
        //         _this.key.e = true;
        //         break;
        // }
        switch (e.key) {
            case 'ArrowLeft':
                _this.key.left = true;
                break;
            case 'ArrowUp':
                _this.key.up = true;
                break;
            case 'ArrowRight':
                _this.key.right = true;
                break;
            case 'ArrowDown':
                _this.key.down = true;
                break;
            case 'e':
                _this.key.e = true;
                break;
        }
    }
    /**
     *
     * @param {event} e
     */
    keyup(e) {

        var _this = this;
        
        // switch (e.keyCode) {
            
        //     case 37:
        //         _this.key.left = false;
        //         break;
        //     case 38:
        //         _this.key.up = false;
        //         break;
        //     case 39:
        //         _this.key.right = false;
        //         break;
        //     case 40:
        //         _this.key.down = false;
        //         break;
        //     case 69:
        //         // _this.key.e = true;
        //         _this.editor = !_this.editor
        //         break;
    
        // }
        switch (e.key) {
            
            case 'ArrowLeft':
                _this.key.left = false;
                break;
            case 'ArrowUp':
                _this.key.up = false;
                break;
            case 'ArrowRight':
                _this.key.right = false;
                break;
            case 'ArrowDown':
                _this.key.down = false;
                break;
            case 'e':
                // _this.key.e = true;
                // _this.editor = !_this.editor
                debugger
                break;
    
        }

    }
    /**
     * reload the original map (the same one restored)
     */
    reload_map() {
        this.load_map(this.original_map);
    }
    /**
     *
     * @param {object} map the map to use
     */
    load_map(map) {
        this.state = 'loading';
        async function loadMap(map) {
            return await importModule(map)
                .then(response => {
                    if (response) {
                        console.log(`chargement de la map effectuée`);
                        return response;
                    }
                })
                .catch(err => console.log(err));

        }

        if (typeof map === 'string') {

            loadMap(map)
                .then(newMap => {
                    // console.log(typeof newMap.data[0][0])
                    // debugger
                    this.load_map(newMap);
                });
        }
        if (typeof map === 'undefined'
            || typeof map.data === 'undefined'
            || typeof map.keys === 'undefined') {

            this.error('Error: Invalid map data!');

            return false;
        }

        let map1 = clone(map);
        this.current_map = map1;
        this.original_map = clone(map1);
        
        this.current_map.background = map.background || '#333';
        this.current_map.gravity = map.gravity || { x: 0, y: 0.3 };
        this.tile_size = map.tile_size || 16;
        
        var _this = this;
        
        this.current_map.width = 0;
        this.current_map.height = 0;
        
        // define keys for each data[y][x]
        map.data.forEach(function (row, y) {
            
            _this.current_map.height = Math.max(_this.current_map.height, y);

            row.forEach(function (tile, x) {
                
                _this.current_map.width = Math.max(_this.current_map.width, x);
                
                _this.current_map.data[y][x] = _this.current_map.keys[tile];
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
        
        this.key = {
            left: false,
            right: false,
            up: false,
            down: false
        };
        
        this.log(`map data loaded : ${this.current_map.name}.`);
        
        this.editor = new Editor(this);
        this.state = 'running';
        return true;
    }
    /**
     *
     * @param {number} x position x in current_map.data
     * @param {number} y position y in current_map.data
     */
    get_tile(x, y) {

        return (this.current_map.data[y] && this.current_map.data[y][x]) ? this.current_map.data[y][x] : 0;
    }
    /**
     *
     * @param {number} x position x in canvas.context
     * @param {number} y position y in canvas context
     * @param {object} tile an object define tile
     * @param {CanvasRenderingContext2D} context
     */
    draw_tile(x, y, tile, context) {

        if (!tile || !tile.colour)
            return;

        context.strokeStyle = 'blue';
        context.fillStyle = tile.colour;
        context.fillRect(
            x,
            y,
            this.tile_size,
            this.tile_size
        );
        if(this.state == 'editor') {
            context.setLineDash([5, 5])
            context.strokeRect(x, y, this.tile_size, this.tile_size);
        }
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} context 
     * @param {boolean|number} fore true/false or 1/0
     */
    draw_map(context, fore) {

        for (var y = 0; y < this.current_map.data.length; y++) {
            for (var x = 0; x < this.current_map.data[y].length; x++) {
                
                if ((!fore && !this.current_map.data[y][x].fore) || (fore && this.current_map.data[y][x].fore)) {

                    var t_x = (x * this.tile_size) - this.camera.x;
                    var t_y = (y * this.tile_size) - this.camera.y;

                    if (t_x < -this.tile_size
                        || t_y < -this.tile_size
                        || t_x > this.viewport.x
                        || t_y > this.viewport.y)
                        continue;

                    this.draw_tile(
                        t_x,
                        t_y,
                        this.current_map.data[y][x],
                        context
                    );
                }
            }
        }

    }
    move_player() {


        let tX = this.player.loc.x + this.player.vel.x;
        let tY = this.player.loc.y + this.player.vel.y;

        let offset = Math.round((this.tile_size / 2) - 1);

        let tile = this.get_tile(
            Math.round(this.player.loc.x / this.tile_size),
            Math.round(this.player.loc.y / this.tile_size)
        );
        // this.tile_old = this.tile_old == undefined ? tile : this.tile_old
        if (this.tile_old == undefined || this.tile_old.name !== tile.name) {
            console.log(tile.name);
            this.tile_old = tile;
        }

        // run script early for 'prevention' effects, etc
        if (this.last_tile != tile.id && tile.script) {
            // optionally break out of movement?
            let game = this;
            if (false === this.current_map.scripts[tile.script].call(this, game, tile, this.player))
                return;
        }



        if (tile.gravity) {

            this.player.vel.x += tile.gravity.x;
            this.player.vel.y += tile.gravity.y;

        }
        else {

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

        }
        else
            this.jump_switch++;

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

            if (left1.solid && left1.bounce > bounce)
                bounce = left1.bounce;
            if (left2.solid && left2.bounce > bounce)
                bounce = left2.bounce;
            if (right1.solid && right1.bounce > bounce)
                bounce = right1.bounce;
            if (right2.solid && right2.bounce > bounce)
                bounce = right2.bounce;

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

            if (top1.solid && top1.bounce > bounce)
                bounce = top1.bounce;
            if (top2.solid && top2.bounce > bounce)
                bounce = top2.bounce;
            if (bottom1.solid && bottom1.bounce > bounce)
                bounce = bottom1.bounce;
            if (bottom2.solid && bottom2.bounce > bounce)
                bounce = bottom2.bounce;

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

        /*
        if(this.last_tile != tile.id && tile.script) {
    
            this.current_map.scripts[tile.script].apply(this)
            // debugger
            // this.current_map.scripts[tile.script](this)
        }
        */
        this.last_tile = tile.id;
    }
    update_player() {

        if (this.state != "infos") {

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

            if (this.key.down) {
                // if (!this.debug) {this.debug = true;}
            }


        }

        this.move_player();
    }
    draw_player(context) {

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
    }

    /**
     * 
     */
    update() {

        this.update_player();
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} context 
     * 
     */
    draw(context) {

        this.draw_map(context, false);
        this.draw_player(context);
        this.draw_map(context, true);

    }
}

export { GGame }
