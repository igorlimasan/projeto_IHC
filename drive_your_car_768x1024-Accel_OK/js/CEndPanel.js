
				window.fbAsyncInit = function() {
				FB.init({
				  appId      : '7628348405127775',
				  xfbml      : true,
				  version    : 'v2.5'
				});
			  };

			  (function(d, s, id){
				 var js, fjs = d.getElementsByTagName(s)[0];
				 if (d.getElementById(id)) {return;}
				 js = d.createElement(s); js.id = id;
				 js.src = "//connect.facebook.net/en_US/sdk.js";
				 fjs.parentNode.insertBefore(js, fjs);
			   }(document, 'script', 'facebook-jssdk'));
			   
			   FB.ui({
					  method: 'feed',
					  link: 'https://developers.facebook.com/docs/',
					  caption: 'An example caption',
					}, function(response){alert(response);}
				);
	
function CEndPanel(oSpriteBg){
    
    var _oBg;
    var _oScoreTextBack;
    var _oScoreText;
    var _oMsgText;
    var _oMsgTextBack;
    var _oGroup;
    
    this._init = function(oSpriteBg){
        
        _oBg = new createjs.Bitmap(oSpriteBg);
        _oBg.x = 0;
        _oBg.y = 0;

        _oMsgTextBack = new createjs.Text("","bold 80px Arial", "#000");
        _oMsgTextBack.x = CANVAS_WIDTH/2 +2;
        _oMsgTextBack.y = (CANVAS_HEIGHT/2)-98;
        _oMsgTextBack.textAlign = "center";

        _oMsgText = new createjs.Text("","bold 80px Arial", "#ffffff");
        _oMsgText.x = CANVAS_WIDTH/2;
        _oMsgText.y = (CANVAS_HEIGHT/2)-100;
        _oMsgText.textAlign = "center";
        
        _oScoreTextBack = new createjs.Text("","bold 50px Arial", "#000");
        _oScoreTextBack.x = CANVAS_WIDTH/2 +2;
        _oScoreTextBack.y = (CANVAS_HEIGHT/2)+22;
        _oScoreTextBack.textAlign = "center";
        
        _oScoreText = new createjs.Text("","bold 50px Arial", "#ffffff");
        _oScoreText.x = CANVAS_WIDTH/2;
        _oScoreText.y = (CANVAS_HEIGHT/2)+20;
        _oScoreText.textAlign = "center";
        
        _oGroup = new createjs.Container();
        _oGroup.alpha = 0;
        _oGroup.visible=false;
        
        _oGroup.addChild(_oBg, _oScoreTextBack,_oScoreText,_oMsgTextBack,_oMsgText);

        s_oStage.addChild(_oGroup);
    };
    
    this._initListener = function(){
        _oGroup.on("mousedown",this._onExit);
		var r = confirm("Deseja compartilhar a sua pontuação no Facebook?");
		if (r == true) {
			FB.ui({
				  method: 'share_open_graph',
				  action_type: 'og.likes',
				  action_properties: JSON.stringify({
					  object:'https://developers.facebook.com/docs/',
				  })
				}, function(response){});
		} else {
			location.reload();
		}
		
		
    };
	
	/*function share() {
	FB.ui(
	  {
	   method: 'feed', //Método para postar no Mural
	   name: 'Eu fiz ' +iScore+' pontos no Drive Your Car',
	   caption: 'Drive Your Car',
	   description: 'Eu fiz ' +iScore+' pontos no Drive Your Car, jogue você também',
	   link: 'http://google.com/', //Link a ser compartilhado
	   picture: 'http://google.com/logo.png' //Imagem do Share
	  },
	  function(response) {
		 console.log(response); //Callback da função.
	  }
	);
}*/
    
    this.show = function(iScore){
        _oMsgTextBack.text = TEXT_GAME_OVER;
        _oMsgText.text = TEXT_GAME_OVER;

        _oScoreTextBack.text = TEXT_SCORE+": "+iScore;
        _oScoreText.text = TEXT_SCORE+": "+iScore;
        _oGroup.visible = true;
        
        var oParent = this;
        createjs.Tween.get(_oGroup).to({alpha:1 }, 500).call(function() {oParent._initListener();});
		
		$(s_oMain).trigger("save_score",iScore);
    };
    
    this._onExit = function(){
        _oGroup.off("mousedown");
        s_oGame._onExit();
    };
    
    this._init(oSpriteBg);
}