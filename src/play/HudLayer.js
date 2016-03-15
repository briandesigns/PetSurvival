var HudLayer = cc.Layer.extend({
    labelHealth:null,
    labelHealthPoint:null,
    labelSpeed:null,
    labelHitPoint:null,
    item1:null,
    item2:null,
    item3:null,
    item4:null,
    item5:null,

    ctor:function () {
        this._super();
        this.init();
    },

    init:function () {
        this._super();
        var winsize = cc.director.getWinSize();

        this.labelHealth = new cc.LabelTTF("Health:", "Helvetica", 20);
        this.labelHealth.setColor(cc.color(255,255,255));//black color
        this.labelHealth.setPosition(cc.p(70, winsize.height - 20));
        this.addChild(this.labelHealth);

        this.labelHealthPoint = new cc.LabelTTF("HealthPoint:", "Helvetica", 20);
        this.labelHealthPoint.setColor(cc.color(255,255,255));//black color
        this.labelHealthPoint.setPosition(cc.p(70, winsize.height - 40));
        this.addChild(this.labelHealthPoint);

        this.labelSpeed = new cc.LabelTTF("Speed:", "Helvetica", 20);
        this.labelSpeed.setColor(cc.color(255,255,255));//black color
        this.labelSpeed.setPosition(cc.p(70, winsize.height - 60));
        this.addChild(this.labelSpeed);

        this.labelHitPoint = new cc.LabelTTF("HitPoint:", "Helvetica", 20);
        this.labelHitPoint.setColor(cc.color(255,255,255));//black color
        this.labelHitPoint.setPosition(cc.p(70, winsize.height - 80));
        this.addChild(this.labelHitPoint);
    }
});