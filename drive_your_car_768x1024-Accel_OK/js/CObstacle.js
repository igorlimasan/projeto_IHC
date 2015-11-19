function CObstacle(iStartX,iStartY,oSprite){
    var _bActive = true;
    var _iWidth;
    var _iHeight;
    var _iScale;
    var _iSpeed;
    var _iStartX;
    var _iStartY;
    var _bNextCalled;
    var _oSpriteObj;
    var _oAnimationRun;
    var _iDistTraveled;
    
    this._init = function(iStartX,iStartY,oSpriteRun){
        _iDistTraveled = 0;
        _iSpeed = -1;
        _bNextCalled = false;
        _iScale = 1;
		
        var oData = {   // image to use
                framerate : 20,
                images: [oSpriteRun], 
                // x,y,width, height,page, x registration point, y registration point
                frames:[[0,0,98,200,0,49,100],
                       [98,0,98,200,0,49,100],
                       [196,0,98,200,0,49,100],
                       [292,0,96,200,0,48,100],
                       [388,0,96,200,0,48,100],
                       [484,0,96,200,0,48,100],
                       [580,0,108,168,0,54,84],
                       [688,0,108,168,0,54,84],
                       [796,0,108,168,0,54,84],
                       [904,0,80,200,0,40,100],
                       [984,0,80,200,0,40,100],
                       [1064,0,80,200,0,40,100]

                ],
                animations: {  enemy_1: [0, 1],enemy_2: [1, 2],enemy_3: [2, 3],
                               enemy_4: [3, 4],enemy_5: [4, 5],enemy_6: [5, 6],enemy_7: [6, 7],
                               enemy_8: [7, 8],enemy_9: [8, 9],enemy_10: [9, 10],enemy_11: [10, 11],
                               enemy_12: [11, 12],}
                        
        };
	
        var iRandEnemy = Math.floor(Math.random() * (12 - 1) + 1);
        
	_oSpriteObj = new createjs.SpriteSheet(oData);
        _oAnimationRun = new createjs.Sprite(_oSpriteObj, "enemy_"+iRandEnemy);
       _oAnimationRun.stop();

        _oAnimationRun.x = iStartX;
        _oAnimationRun.y = iStartY;
        s_oStage.addChild(_oAnimationRun);

        _iWidth = 100;
        _iHeight = 200;
        _iStartX = iStartX;
        _iStartY = iStartY;

    };
    
    this.reset = function(){ 
        _oAnimationRun.y -= ((CANVAS_HEIGHT*8)+DISTANCE_AMONG_OBSTACLES);
    };
    
    this.getPos = function(){
        return { x: _oAnimationRun.x, y: _oAnimationRun.y};
    };
    
    this.getY = function(){
        return _oAnimationRun.y;
    };
    
    this.getFront = function(){
        return _oAnimationRun.y - (_iHeight/2);
    };
    
    this.getRadius = function(){
        return (_iHeight-40);
    };
    
    this.isActive = function(){
      return _bActive;  
    };
    
    this.update = function(iHeroSpeed){
        _oAnimationRun.y =_oAnimationRun.y + (iHeroSpeed+_iSpeed); 
    };
    
    this._init(iStartX,iStartY,oSprite);
}