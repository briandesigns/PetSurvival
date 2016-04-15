var EndPoint = Location.extend({
   animation : null,

    /**
     * the goal location that the player needs to reach
     * @param space
     */
    ctor: function (space) {
        this._super(COLLISION_TYPE.end, new cc.PhysicsSprite(res.EndPoint), 0.15, space);
        
        //endpoint sprite animation
        cc.spriteFrameCache.addSpriteFrames(res.human_plist);
        this.spriteSheet = new cc.SpriteBatchNode(res.human_png);

        var animframes = [];  
        animframes.push(cc.spriteFrameCache.getSpriteFrame("EndPoint1.png"));
        animframes.push(cc.spriteFrameCache.getSpriteFrame("EndPoint4.png"));
        animframes.push(cc.spriteFrameCache.getSpriteFrame("EndPoint5.png"));
        animframes.push(cc.spriteFrameCache.getSpriteFrame("EndPoint2.png"));
        animframes.push(cc.spriteFrameCache.getSpriteFrame("EndPoint5.png"));
        animframes.push(cc.spriteFrameCache.getSpriteFrame("EndPoint4.png"));

        var anim = new cc.Animation(animframes, 0.5);
        this.animation = new cc.RepeatForever(new cc.Animate(anim));
        this.sprite.runAction(this.animation);
    }

});
