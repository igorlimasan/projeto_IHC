function CMenu(){
    var _oBg;
    var _oButPlay;
    var _oFade;
    
    this._init = function(){
        _oBg = new createjs.Bitmap(s_oSpriteLibrary.getSprite('bg_menu'));
        s_oStage.addChild(_oBg);
        
        var oSprite = s_oSpriteLibrary.getSprite('but_play');
        _oButPlay = new CTextButton((CANVAS_WIDTH/2),CANVAS_HEIGHT-150,oSprite,TEXT_PLAY,"Arial","#000000",42);
        _oButPlay.addEventListener(ON_MOUSE_UP, this._onButPlayRelease, this);
        
        if(s_bMobile === false){
            _oAudioToggle = new CToggle(CANVAS_WIDTH - 60,60,s_oSpriteLibrary.getSprite('audio_icon'),s_bAudioActive);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
        }
        
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        
        s_oStage.addChild(_oFade);
        
        createjs.Tween.get(_oFade).to({alpha:0}, 1000).call(function(){_oFade.visible = false;});  
    };
    
    this.unload = function(){
        _oButPlay.unload(); 
        _oButPlay = null;
        s_oStage.removeChild(_oBg);
        _oBg = null;
    };
    
    this._onButPlayRelease = function(){
        this.unload();
        s_oMain.gotoGame();
    };
    
    this._onAudioToggle = function(){
        createjs.Sound.setMute(s_bAudioActive);
	s_bAudioActive = !s_bAudioActive;
    };
    
    this._init();
}