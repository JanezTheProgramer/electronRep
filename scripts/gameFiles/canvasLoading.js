exports.canvasLoader = class {
    constructor(canvas) {
        this.init = () => {
            this.canvas = canvas;
            this.ctx = this.canvas.getContext('2d');
            this.ctx.lineWidth = .5;
            this.ctx.strokeStyle = 'rgba(0,0,0,.75)';
            this.count = 75;
            this.rotation = 270 * (Math.PI / 180);
            this.speed = 6;
            this.canvasLoop();
        }

        this.updateLoader = () => {
            this.rotation += this.speed / 100;
        };
        
        this.renderLoader = () => {
            this.ctx.save();
            this.ctx.globalCompositeOperation = 'source-over';
            this.ctx.translate(125, 125);
            this.ctx.rotate(this.rotation);
            var i = this.count;
            while (i--) {
                this.ctx.beginPath();
                this.ctx.arc(0, 0, i + (Math.random() * 35), Math.random(), Math.PI / 3 + (Math.random() / 12), false);
                this.ctx.stroke();
            }
            this.ctx.restore();
        };
        
        this.canvasLoop = () => {
            window.requestAnimationFrame(this.canvasLoop, this.canvas);
            this.ctx.globalCompositeOperation = 'destination-out';
            this.ctx.fillStyle = 'rgba(0,0,0,.03)';
            this.ctx.fillRect(0, 0, 250, 250);
            this.updateLoader();
            this.renderLoader();
        };
    }
}