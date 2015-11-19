
function CGame(oInfo){
    var _bUpdate = false;
    var _iSpeed;
    var _iMaxHeroSpeed;
    var _iScore = 0;
    var _iScoreInterval = 0;
    var _iLives;
    var _iCurHeroX;
    var _iInterval;
    var _oBg;
    var _oButExit;  
    var _aLineXPos;
    var _aObstaclePos;
    var _aObstacleInScene;
    var _oHero;
    var _oHurt;
    var _oButLeft;
    var _oButRight;
    var _oButJump;
    var _oScoreText;
    var _oScoreTextBack;
    var _oLivesText;
    var _oLivesTextBack;
    var _oGameOverPanel;
    var _oScrollingBg;
    var _oHelpBg;
    var _oAudioToggle;
    
    this._init = function(){
        var oBgCanvas = new createjs.Shape();
        oBgCanvas.graphics.beginFill("#5B89A1").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        s_oStage.addChild(oBgCanvas);
        
        _oBg = new createjs.Bitmap(s_oSpriteLibrary.getSprite('bg_game'));
        s_oStage.addChild(_oBg);

        this._initLineObjects();
        this._initObstacles();
        
        var oBgGUI = new createjs.Shape();
        oBgGUI.graphics.beginFill("rgba(0,0,0,0.5)").drawRect(0,0,CANVAS_WIDTH,100);
        s_oStage.addChild(oBgGUI);
        
        oBgGUI = new createjs.Shape();
        oBgGUI.graphics.beginFill("rgba(0,0,0,0.5)").drawRect(0,924,CANVAS_WIDTH,100);
        s_oStage.addChild(oBgGUI);
        
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _oButExit = new CGfxButton(CANVAS_WIDTH - (oSprite.width/2) - 10,10+ (oSprite.height/2),oSprite,true);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);
        
        if(s_bMobile === false){
            document.onkeyup   = onKeyUp; 
            _oAudioToggle = new CToggle(CANVAS_WIDTH - 150,10+ (oSprite.height/2),s_oSpriteLibrary.getSprite('audio_icon'),s_bAudioActive);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
        }
		
        
        _iLives = NUM_LIVES;
        _iCurHeroX  = 1;
        var oSpriteHero = s_oSpriteLibrary.getSprite('hero');
        _oHero = new CHero(_aLineXPos[_iCurHeroX],oSpriteHero);
        
        var oSpriteLife = s_oSpriteLibrary.getSprite("life"); 
        var oLife = new createjs.Bitmap(oSpriteLife);
        oLife.x = 10;
        oLife.y = 15;
        s_oStage.addChild(oLife);
        
        _oScoreTextBack = new createjs.Text(TEXT_SCORE+": 0","bold 50px Arial", "#000000");
        _oScoreTextBack.x = (CANVAS_WIDTH/2) + 2;
        _oScoreTextBack.y = 32;
        _oScoreTextBack.textAlign = "center";
        s_oStage.addChild(_oScoreTextBack);
        
        _oScoreText = new createjs.Text(TEXT_SCORE+": 0","bold 50px Arial", "#ffffff");
        _oScoreText.x = (CANVAS_WIDTH/2);
        _oScoreText.y = 30;
        _oScoreText.textAlign = "center";
        s_oStage.addChild(_oScoreText);

        _oLivesTextBack = new createjs.Text("X"+_iLives,"bold 50px Arial", "#000000");
        _oLivesTextBack.x = 132;
        _oLivesTextBack.y = 32;
        _oLivesTextBack.textAlign = "center";
        s_oStage.addChild(_oLivesTextBack);

        _oLivesText = new createjs.Text("X"+_iLives,"bold 50px Arial", "#ffffff");
        _oLivesText.x = 130;
        _oLivesText.y = 30;
        _oLivesText.textAlign = "center";
        s_oStage.addChild(_oLivesText);
        
        _oHurt = new createjs.Shape();
        _oHurt.graphics.beginFill("red").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        _oHurt.alpha = 0.1;
        _oHurt.visible =  false;
        
        s_oStage.addChild(_oHurt);
        
        oSprite = s_oSpriteLibrary.getSprite('but_left');
        _oButLeft = new CGfxButton(BUT_LEFT_X,BUT_LEFT_Y,oSprite,true);
        _oButLeft.addEventListener(ON_MOUSE_UP, this._onReleaseLeft, this);
        
        oSprite = s_oSpriteLibrary.getSprite('but_right');
        _oButRight = new CGfxButton(BUT_RIGHT_X,BUT_RIGHT_Y,oSprite,true);
        _oButRight.addEventListener(ON_MOUSE_UP, this._onReleaseRight, this);
        
        oSprite = s_oSpriteLibrary.getSprite('but_jump');
        _oButJump = new CTextButton(CANVAS_WIDTH/2,BUT_RIGHT_Y,oSprite,TEXT_JUMP,"Arial","#383838",40);
        _oButJump.addEventListener(ON_MOUSE_UP, this._onReleaseJump, this);
        _oButJump.getButtonImage().visible = false;
       
       _oHelpBg = new CHelpPanel(s_oSpriteLibrary.getSprite('bg_help'));
       
        _iSpeed = 0;
        _iMaxHeroSpeed = MAX_STARTING_SPEED;
    };
    
    this.unload = function(){
        _oButExit.unload();       
        _oButExit = null;
        
        _oButLeft.unload();
        _oButLeft = null;
        
        _oButRight.unload();
        _oButRight = null;
    };
    
    function onKeyUp(evt) { 
        if ( _bUpdate === false){
            return;
        }
        
        if(!evt){ 
            var evt = window.event; 
        }  

        switch(evt.keyCode) {  
           // left  
           case 37: s_oGame.shiftLeft();
           break;                    
           // right  
           case 39: s_oGame.shiftRight();
           break;  
           //SPACEBAR
           case 32: s_oGame.jump();
           break;
        }  
    }
	
	

		if(window.DeviceMotionEvent)
		{
			
			window.addEventListener('devicemotion',function(eventData)
			{
				if(eventData.accelerationIncludingGravity.x!=null)
				{
					
					if(eventData.accelerationIncludingGravity.x > 3.5)
					{
						s_oGame.shiftLeft();
						
												
					}
					
					else if(eventData.accelerationIncludingGravity.x < -3.5)
					{
						s_oGame.shiftRight();
						
						
					}
					
					if(eventData.accelerationIncludingGravity.y>=9)
					{
						s_oGame.jump()
					}
				}
				
			},false);
		}
	
       
    this.shiftLeft = function(){
            this._onReleaseLeft();
    };
    
    this.shiftRight = function(){
            this._onReleaseRight();
    };
    
    this.jump = function(){
        if(_oButJump.getButtonImage().visible === false){
            return;
        }
        this._onReleaseJump();
    };
    
    this._onExitHelp = function(){
        _oHelpBg.unload();
        s_oStage.removeChild(_oHelpBg);
        
        _bUpdate = true;
        _iInterval = setInterval(this._increaseScore,1000);
    };
    
    this._initLineObjects = function(){
        _aLineXPos = new Array(128,384,640);

         var oSprite = s_oSpriteLibrary.getSprite('road_tile');
         _oScrollingBg = new CScrollingBg(oSprite);
    };
    
     this._initObstacles = function(){
         
         _aObstaclePos = new Array();
         
         _aObstaclePos[0]  = [_aLineXPos[0]];
         _aObstaclePos[1]  = [_aLineXPos[1]];
         _aObstaclePos[2]  = [_aLineXPos[2]];
         _aObstaclePos[3]  = [_aLineXPos[0],_aLineXPos[1]];
         _aObstaclePos[4]  = [_aLineXPos[1],_aLineXPos[2]];
         _aObstaclePos[5]  = [_aLineXPos[2],_aLineXPos[0]];
         _aObstaclePos[6]  = [_aLineXPos[0],_aLineXPos[1]];
         _aObstaclePos[7]  = [_aLineXPos[1],_aLineXPos[2]];
         _aObstaclePos[8]  = [_aLineXPos[2],_aLineXPos[0]];
         _aObstaclePos[9]  = [_aLineXPos[2],_aLineXPos[0]];
         _aObstaclePos[10] = [_aLineXPos[0],_aLineXPos[1]];
         _aObstaclePos[11] = [_aLineXPos[1],_aLineXPos[2]];
         _aObstaclePos[12] = [_aLineXPos[2],_aLineXPos[0]];
         _aObstaclePos[13] = [_aLineXPos[0],_aLineXPos[1]];
         _aObstaclePos[14] = [_aLineXPos[1],_aLineXPos[2]];
         _aObstaclePos[15] = [_aLineXPos[0],_aLineXPos[1],_aLineXPos[2]];
         
         _aObstaclePos = shuffle(_aObstaclePos);
         
         _aObstacleInScene = new Array();
         var oSprite = s_oSpriteLibrary.getSprite('enemy');
         var iCont = 0;
         var iYPos = -oSprite.height;
         
         while(iYPos > - (CANVAS_HEIGHT*8)){
             for(var k=0;k<_aObstaclePos[iCont].length;k++){
                 var oObstacle = new CObstacle(_aObstaclePos[iCont][k],iYPos,oSprite);
                 _aObstacleInScene.push(oObstacle);    
             }
             iYPos -= (oSprite.height + DISTANCE_AMONG_OBSTACLES);
             iCont++;
         }
     };
     
     this._increaseScore = function(){
         _iScore += SCORE_INCREASE;
         _oScoreText.text = TEXT_SCORE+": "+_iScore;
         _oScoreTextBack.text = TEXT_SCORE+": "+_iScore;
         
         _iScoreInterval += SCORE_INCREASE;
         if(_iScoreInterval > INCREASE_SPEED_UP_INTERVAL){
             _iScoreInterval = 0;
             _iMaxHeroSpeed += INCREASE_SPEED;
         }
     };
     
     this._lifeLost = function(){
        _oHurt.visible = true;
        var oParent = this;
        
        createjs.Tween.get(_oHurt).to({alpha:0.6 }, 400).call(function() {oParent._resetHurt();});
        
        
        _iScore -= MALUS_SCORE;
        if(_iScore<0){
            _iScore = 0;
        }
        
        _oScoreText.text = TEXT_SCORE+": "+_iScore;
        _oScoreTextBack.text = TEXT_SCORE+": "+_iScore;
        
        if(s_bMobile === false){
            createjs.Sound.play("crash");
        }
        
        _iLives--;
        _oLivesText.text = "X"+_iLives;
        _oLivesTextBack.text = "X"+_iLives;
        
        if(_iLives === 0){
            this._gameOver();
			
        }
    };
    
    this._resetHurt = function(){
        _oHurt.visible = false;
        _oHurt.alpha = 0.5;
    };
    
    this._gameOver = function(){
        _bUpdate = false;
        clearInterval(_iInterval);
        
        var oSprite = s_oSpriteLibrary.getSprite('msg_box');
        _oGameOverPanel = new CEndPanel(oSprite);
        _oGameOverPanel.show(_iScore);
		
    };
    
    this._onReleaseLeft = function(){
        if(_iCurHeroX === 0 || _oHero.isTweening() || _oHero.isJumping()){
            return;
        }
        
        _iCurHeroX--;
        _oHero.move(_aLineXPos[_iCurHeroX]);
    };
    
    this._onReleaseRight = function(){
        if(_iCurHeroX === NUM_LINES || _oHero.isTweening() || _oHero.isJumping()){
            return;
        }
        
        _iCurHeroX++;
        _oHero.move(_aLineXPos[_iCurHeroX],1-((NUM_LINES-_iCurHeroX)*0.2));
    };
    
    this._onReleaseJump = function(){
        
        _oHero.jump(_iSpeed);
        
        if(s_bMobile === false){
            createjs.Sound.play("jump");
        }
    };
    
    this._onExit = function(){
        this.unload();
        
        s_oMain.gotoMenu();
		
	$(s_oMain).trigger("restart");
    };
    
    this._onAudioToggle = function(){
        createjs.Sound.setMute(s_bAudioActive);
	s_bAudioActive = !s_bAudioActive;
    };
    
    this._checkCollision = function(  oObstacle ){
        var vHeroPos        = _oHero.getPos();
        var vObstaclePos    = oObstacle.getPos();
        var fObstacleRadius = oObstacle.getRadius();
        
        var fDistance =  Math.sqrt( ( (vObstaclePos.x - vHeroPos.x)*(vObstaclePos.x - vHeroPos.x) ) + 
                                    ( (vObstaclePos.y - vHeroPos.y)*(vObstaclePos.y - vHeroPos.y) ) );
		
        if ( fDistance < fObstacleRadius ){
            return true;
        }else{
            return false;
        }
    };
    
    this._updateMove = function(){
       _iSpeed += ACCELLERATION;
       if(_iSpeed > _iMaxHeroSpeed){
          _iSpeed = _iMaxHeroSpeed;
          _oButJump.getButtonImage().visible = true;
       }
       
       _oHero.update();
       _oScrollingBg.update(_iSpeed);
        
    };
    
    this.updateObstacles = function(){
        for(var i=0;i<_aObstacleInScene.length;i++){
            _aObstacleInScene[i].update(_iSpeed);
            if( _oHero.isJumping() === false && this._checkCollision(_aObstacleInScene[i]) ){
                _aObstacleInScene[i].reset();
                
                this._lifeLost();
            }else if(_aObstacleInScene[i].getFront() > CANVAS_HEIGHT){
                _aObstacleInScene[i].reset();
            }
            
        }
    };
    
    this.update = function(){
        if(_bUpdate === false){
            return;
        }

        this._updateMove();
        this.updateObstacles();    
    };
    
    s_oGame=this;
    
    MAX_STARTING_SPEED = oInfo.max_start_speed;
    INCREASE_SPEED_UP_INTERVAL = oInfo.increase_speed_up_interval;
    INCREASE_SPEED = oInfo.increase_speed;
    DISTANCE_AMONG_OBSTACLES = oInfo.dist_obstacles;
    ACCELLERATION = oInfo.accelleration;
    SCORE_INCREASE = oInfo.score_increase;
    MALUS_SCORE = oInfo.malus_score;
    NUM_LIVES = oInfo.lives;
    
    this._init();
}

var s_oGame;
