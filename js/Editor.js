
class Editor {
    constructor(game){
        this.game = game
        this.cursor = {
            loc: {
                x: game.player.loc.x,
                y: game.player.loc.y
            } 
        }

        this.key = {
            left: false,
            right: false,
            up: false,
            down: false
        };

        // this.game.current_map.player = this.game.original_map.player
        
        window.addEventListener('keydown', this.keydown.bind(this))
        window.addEventListener('keyup', this.keyup.bind(this))
        // window.onkeydown = this.keydown.bind(this);
        // window.onkeyup = this.keyup.bind(this);
    }
/**
     *
     * @param {event} e
     */
    keydown(e) {

        var _this = this;

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
                debugger
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
    update() {
        
        // this.game.
    }

    draw(context){

    }
}

export { Editor }