function CHelpPanel(oSprite){
    var _oText;
    var _oTextBack;
    var _oHelpBg;
    var _oGroup;

    this._init = function(oSprite){
        _oHelpBg = new createjs.Bitmap(oSprite); 

        _oTextBack = new createjs.Text(TEXT_HELP1,"bold 30px Arial", "#000000");
        _oTextBack.textAlign = "center";
        _oTextBack.x = CANVAS_WIDTH/2 + 2;
        _oTextBack.y = 312;
		
	_oText = new createjs.Text(TEXT_HELP1,"bold 30px Arial", "#ffffff");
        _oText.textAlign = "center";
        _oText.x = CANVAS_WIDTH/2;
        _oText.y = 310;

        var oTextBack2 = new createjs.Text(TEXT_HELP2,"bold 36px Arial", "#000000");
        oTextBack2.textAlign = "center";
        oTextBack2.x = CANVAS_WIDTH/2 + 2;
        oTextBack2.y = 639;
		
	var oText2 = new createjs.Text(TEXT_HELP2,"bold 36px Arial", "#ffffff");
        oText2.textAlign = "center";
        oText2.x = CANVAS_WIDTH/2;
        oText2.y = 637;

        _oGroup = new createjs.Container();
        _oGroup.addChild(_oHelpBg,_oTextBack,_oText,oTextBack2,oText2);
        s_oStage.addChild(_oGroup);
        
        var oParent = this;
        _oGroup.on("pressup",function(){oParent._onExitHelp()});
    };

    this.unload = function(){
        s_oStage.removeChild(_oGroup);

        var oParent = this;
        _oGroup.off("pressup",function(){oParent._onExitHelp()});
    };

    this._onExitHelp = function(){
        this.unload();
        s_oGame._onExitHelp();
    };

    this._init(oSprite);

}