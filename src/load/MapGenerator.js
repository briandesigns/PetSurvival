var MapGenerator = {
    Terrain: function (size) {
        this.size = size; //if weird stuff happens this is where you add 1 to a power of 2
        this.max = this.size - 1;
        this.map = new Float32Array(this.size * this.size);
        console.log(size);
    }
};