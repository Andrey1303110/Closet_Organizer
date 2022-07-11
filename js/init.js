

document.readyState === 'loading'
    ? // The document is still loading
    document.addEventListener('DOMContentLoaded', function (e) {
        initMRAID();
    })
    : // The document is loaded completely
    initMRAID();


function initMRAID() {

    if(window.MRAIDNetworkID)
    {
        // Wait for the SDK to become ready
        if (mraid.getState() === 'loading')
        {
            mraid.addEventListener('ready', onSdkReady);
        }
        else
        {
            onSdkReady();
        }
    } else
    {
        initGame();
        document.addEventListener("visibilitychange", visibilityListener);
    }

}

function visibilityListener() {
    switch(document.visibilityState) {
        case "hidden":
            //PAUSE SOUNDS
            break;
        case "visible":
            //RESUME SOUNDS
            break;
    }
}

function viewableChangeHandler(viewable) {
// start/pause/resume gameplay, stop/play sounds
    if(viewable) {
        //RESUME SOUNDS
        showMyAd();

    } else {
        //PAUSE SOUNDS
    }

    if (GlobalData.appPlayed)
    {
        //createjs.Ticker.paused = viewable;
    }

}
function onSdkReady()
{
    mraid.addEventListener('viewableChange', viewableChangeHandler);
// Wait for the ad to become viewable for the first time
    if (mraid.isViewable()) {
        showMyAd();
    }
}
function showMyAd()
{
    if(!window.appPlayed)
    {
        initGame();
    }
}


function initGame() {
    window.appPlayed = true;

    if(window.mintegralNetworkID)
    {
        window.gameReady && window.gameReady();
        return;
    }
    createGame();
}

function gameStart() {
    //mintegral
    createGame();
    //RESUME SOUNDS

}
function gameClose() {
    // do something
    //POUSE SOUNDS
}
var game;
function createGame()
{

    game = new Phaser.Game(config);

    window.addEventListener('resize', resizeHandler);
    resizeHandler();

}

function resizeHandler() {

    //RESIZE GAME

}

function gotoStoreHandler() {

    if(window.mintegralNetworkID)
    {
        window.install && window.install();
        return;
    }



    if(window.TikTokNetworkID)
    {
        window.playableSDK.openAppStore();
        return;

    }

    if(window.MRAIDNetworkID)
    {
        if(window.MRAIDWithURL)
        {
            // Detect platform from user agent
            var userAgent = navigator.userAgent || navigator.vendor;
            var url = 'https://apps.apple.com/app/id1625252883';
            var android = 'https://play.google.com/store/apps/details?id=com.tpgame.fillthecloset';
            if (/android/i.test(userAgent)) {
                url = android;
            }
            mraid.open(url);
        } else
        {
            mraid.open("");
        }

    } else
    {
        /*if ( isFunction('callSDK') )
        {

        }*/

        alert("Go to store");
    }
}

