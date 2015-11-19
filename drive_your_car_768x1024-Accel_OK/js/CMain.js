function CMain(){

    var _iCurResource = 0;
    var RESOURCE_TO_LOAD;
    var _iState = STATE_LOADING;
    
    var _oPreloader;
    var _oMenu;
    var _oHelp;
    var _oGame;

    this.initContainer = function(){
        var canvas = document.getElementById("canvas");
        s_oStage = new createjs.Stage(canvas);
        createjs.Touch.enable(s_oStage);
        s_bMobile = jQuery.browser.mobile;
        
        s_iPrevTime = new Date().getTime();

	createjs.Ticker.addEventListener("tick", this._update);
        s_oSpriteLibrary  = new CSpriteLibrary();

        //ADD PRELOADER
        _oPreloader = new CPreloader();
        
        if(s_bMobile === false){
            s_oStage.enableMouseOver(20);  
            this._initSounds();
        }
        
        this._loadImages();
        
    };
    
    this._initSounds = function(){
         if (!createjs.Sound.initializeDefaultPlugins()) {
             return;
         }
         
         createjs.Sound.alternateExtensions = ["ogg"];
         createjs.Sound.addEventListener("fileload", createjs.proxy(this.handleFileLoad, this));
            
         createjs.Sound.registerSound("./sounds/soundtrack.mp3", "soundtrack");
         createjs.Sound.registerSound("./sounds/jump.mp3", "jump");
         createjs.Sound.registerSound("./sounds/jump_end.mp3", "jump_end");
         createjs.Sound.registerSound("./sounds/crash.mp3", "crash");

         RESOURCE_TO_LOAD +=4;
    };
    
    this.handleFileLoad = function(){
         _iCurResource++;
         if(_iCurResource === RESOURCE_TO_LOAD){
             _oPreloader.unload();
            
            if(s_bMobile === false){
                s_oSoundTrackSnd = createjs.Sound.play("soundtrack", {interrupt: createjs.Sound.INTERRUPT_ANY, loop:-1,volume:0.5});
            }
            
            this.gotoMenu();
         }
    };
    
    this._loadImages = function(){
        s_oSpriteLibrary.init( this._onImagesLoaded,this._onAllImagesLoaded, this );

        s_oSpriteLibrary.addSprite("but_play","./sprites/but_play.png");
        s_oSpriteLibrary.addSprite("but_exit","./sprites/but_exit.png");
        s_oSpriteLibrary.addSprite("bg_menu","./sprites/bg_menu.jpg");
        s_oSpriteLibrary.addSprite("bg_help","./sprites/bg_help.png");
        s_oSpriteLibrary.addSprite("road_tile","./sprites/road_tile.jpg");
        s_oSpriteLibrary.addSprite("hero","./sprites/hero.png");
        s_oSpriteLibrary.addSprite("but_right","./sprites/but_right.png");
        s_oSpriteLibrary.addSprite("but_left","./sprites/but_left.png");
        s_oSpriteLibrary.addSprite("but_jump","./sprites/but_jump.png");
        s_oSpriteLibrary.addSprite("enemy","./sprites/enemy.png");
        s_oSpriteLibrary.addSprite("life","./sprites/life.png");
        s_oSpriteLibrary.addSprite("msg_box","./sprites/msg_box.png");
        s_oSpriteLibrary.addSprite("audio_icon","./sprites/audio_icon.png");
        
        RESOURCE_TO_LOAD = s_oSpriteLibrary.getNumSprites();
        s_oSpriteLibrary.loadSprites();
    };
    
    this._onImagesLoaded = function(){
        _iCurResource++;
        var iPerc = Math.floor(_iCurResource/RESOURCE_TO_LOAD *100);
        //console.log("PERC: "+iPerc);
        _oPreloader.refreshLoader(iPerc);
        
        if(_iCurResource === RESOURCE_TO_LOAD){
            _oPreloader.unload();  
            
            if(s_bMobile === false){
                s_oSoundTrackSnd = createjs.Sound.play("soundtrack", {interrupt: createjs.Sound.INTERRUPT_ANY, loop:-1,volume:0.5});
            }
            
            this.gotoMenu();
        }
    };
    
    this._onAllImagesLoaded = function(){
        
    };
    
    this.onAllPreloaderImagesLoaded = function(){
        this._loadImages();
    };
    
    this.gotoMenu = function(){
        _oMenu = new CMenu();
        _iState = STATE_MENU;
    };
    
    this.gotoGame = function(){
        _oGame = new CGame({
                            max_start_speed: 12,            //MAX SPEED YOUR CAR CAN REACH INITIALLY 
                            increase_speed_up_interval:20,  //EACH 20 POINTS EARNED GAME IS FASTER
                            increase_speed: 1,              //SPEED ADDED TO THE GAME AFTER INCREASE SPEED UP INTERVAL 
                            dist_obstacles: 550,            //PIXEL DISTANCE AMONG OPPONENT CARS
                            accelleration: 0.24,            //STARTING CAR ACCELLERATION. INCREASE THIS NUMBER TO REACH MAX SPEED FASTER
                            score_increase: 1,              //SCORE INCREASE AMOUNT EACH SECOND
                            malus_score: 0,                 //SET THIS TO POSITIVE INTEGER IF YOU WANT TO DECREASE SCORE AFTER CRASH
                            lives:3                         //NUMBER OF LIVES
        });
        _iState = STATE_GAME;
		
	$(s_oMain).trigger("game_start");
    };
    
    this.gotoHelp = function(){
        _oHelp = new CHelp();
        _iState = STATE_HELP;
    };
    
    this._update = function(event){
        var iCurTime = new Date().getTime();
        s_iTimeElaps = iCurTime - s_iPrevTime;
        s_iCntTime += s_iTimeElaps;
        s_iCntFps++;
        s_iPrevTime = iCurTime;
        
        if ( s_iCntTime >= 1000 ){
            s_iCurFps = s_iCntFps;
            s_iCntTime-=1000;
            s_iCntFps = 0;
        }
                
        if(_iState === STATE_GAME){
            _oGame.update();
        }
        
        s_oStage.update(event);

    };
    
    s_oMain = this;

    this.initContainer();
}
var s_bMobile;
var s_bAudioActive = true;
var s_iCntTime = 0;
var s_iTimeElaps = 0;
var s_iPrevTime = 0;
var s_iCntFps = 0;
var s_iCurFps = 0;

var s_oSoundTrackSnd;
var s_oDrawLayer;
var s_oStage;
var s_oMain;
var s_oSpriteLibrary;