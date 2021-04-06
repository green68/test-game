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
        9: { id: 9, name: 'lave', colour: '#C93232', solid: 0, script: 'death' },
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
}

export { map as Map }
