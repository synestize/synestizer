declare var T: any;

class Synth {

    name:string;
    sin1:any;


    constructor(name:string) {
        this.name = name;
    }

    play() {
        this.sin1 = T("osc", "sin", 440, 0.25).play();

    }

    update(freq1:number, freq2:number, freq3:number) {

        //this.sin1.set({freq: freq1});
        //this.sin2.set({freq: freq2});
        this.sin3.set({freq: freq3});
    }
}



