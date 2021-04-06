

let map = {
    name: 'map-1',
    tile_size: 22, //16
    next_level: 'map-2.js',
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

    keys: {
        0: { id: 0, name: 'dark', colour: 'rgba(0,0,0,0.8)', solid: 0, fore: 1 },
        1: { id: 1, name: 'background', colour: '#888', solid: 0 },
        2: { id: 2, name: "wall", colour: '#555', solid: 1, bounce: 0.35 },
        3: { id: 3, name: "water", colour: 'rgba(121, 220, 242, 0.4)', friction: { x: 0.9, y: 0.9 }, gravity: { x: 0, y: 0.1 }, jump: 1, fore: 1 },
        4: { id: 4, name: 'unbounce', colour: '#777', jump: 1 },
        5: { id: 5, name: "bounce" , colour: '#E373FA', solid: 1, bounce: 1.1 },
        6: { id: 6, colour: '#666', solid: 1, bounce: 0 },
        7: { id: 7, name: 'col0r', colour: '#73C6FA', solid: 0, script: 'change_colour' },
        8: { id: 8, name: 'door', colour: '#FADF73', solid: 0, script: 'next_level' },
        9: { id: 9, name: 'lava', colour: 'rgba(255,0,0,0.8)', solid: 0, fore: 1, script: 'death' },
        10: { id: 10, name: 'unlock_wall', colour: '#555', solid: 1 },
        11: { id: 11, name: 'unlock', colour: '#0FF', solid: 0, script: 'unlock' }
    },

    /* An array representing the map tiles. Each number corresponds to a key */
    data: [
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 1, 1, 1, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 3, 3, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 3, 9, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 3, 3, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 3, 3, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 3, 3, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 9, 9, 3, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 3, 3, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 3, 3, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 3, 3, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 9, 9, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 3, 8, 2],
        [2, 2, 2, 2, 2, 2, 2, 2, 6, 5, 6, 2, 2, 2, 2, 2, 2],
    ],

    /* Default gravity of the map */

    gravity: {
        x: 0,
        y: 0.3
    },

    /* Velocity limits */

    vel_limit: {
        x: 2,
        y: 16
    },

    /* Movement speed when the key is pressed */

    movement_speed: {
        jump: 6,
        left: 0.3,
        right: 0.3
    },

    /* The coordinates at which the player spawns and the colour of the player */

    player: {
        x: 2,
        y: 2,
        colour: '#FF9900'
    },

    /* scripts refered to by the "script" variable in the tile keys */

    scripts: {
        change_colour: function () {
            this.player.colour = "#" + (Math.random() * 0xFFFFFF << 0).toString(16)
        },
        /* you could load a new map variable here */
        next_level: function () {
            
            this.message('next_level', _ => {
                this.load_map(this.current_map.next_level || this.original_map)
            })
            // alert("OUI! Tu as gagné! ;)")
            // this.load_map(this.current_map.next_level || this.original_map)
        },
        death: function () {
            
            this.message('death',_ => {this.reload_map()})
        },
        unlock: function () {
            this.current_map.keys[10].solid = 0
            this.current_map.keys[10].colour = "#888"
        }
    },

    /* messages pour infos-message  */
    messages: {
        death: `<p>Tu es mort</p><p>Essayes à nouveau</p>`,
        next_level: `<p>OUI</p><p>Tu as réussi</p>`
    }
}

export { map as Map }
