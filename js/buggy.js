var can = $("#can");
var W = can.width();
var H = can.height();
var scl = 40;
var cols = W / scl;
var rows = H / scl;
var gravOn = 0;
var grav = 0.4;
var velo = 0;
var timer;
var timerOn = 0;
var jumpForce = 0.4;
var jumpVelo = 10;
var jumpTimer;
var jumpTimerCount = 0;
var floor = [];
var moveFloorTimer;
var gapTimer;
var gapsArr = [];
var gapCount = 0;
var score = 0;
var points = 10;

function playerSpawn() {
    can.append("<div id='player'></div>");
    var P = $("#player");
    P.css("background-color", "orange");
    P.css("width", scl);
    P.css("height", scl);
    P.css("position", "absolute");
    P.css("left", scl * 2);
    P.css("top", H - scl * 2);
    P.css("padding", "0");
    P.css("margin", "0");
}


function spawnFloor() {
    var i = 0;
    var temp = 0;
    while (i < cols) {
        can.append("<div id='floor" + i + "'></div>");
        var F = $("#floor" + i);
        floor.push(F);
        F.css("width", scl);
        F.css("height", scl);
        F.css("position", "absolute");
        F.css("left", temp);
        F.css("top", H - scl);
        F.css("padding", "0");
        F.css("margin", "0");
        F.css("z-index", "1");
        if (i % 2 === 0) {
            F.css("background-color", "#414141");
        } else {
            F.css("background-color", "#616161");
        }
        // F.css("border", "1px solid #515151");
        temp += scl;
        i++;
    }
}

function rngRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function gaps() {
    for (i in floor) {
        if (floor[i].css("background-color") == "rgb(65, 65, 65)") {
            floor[i].css("background-color", "rgb(97, 97, 97)");
        } else if (floor[i].css("background-color") == "rgb(97, 97, 97)") {
            floor[i].css("background-color", "rgb(65, 65, 65)");
        }
        if ((floor[i].css("background-color") == "rgb(144, 238, 144)") && ((i != 0) && (floor[i - 1].css("background-color") == "rgb(65, 65, 65)"))) {
            floor[i - 1].css("background-color", "rgb(144, 238, 144)");
            floor[i].css("background-color", "rgb(97, 97, 97)");
        } else if ((floor[i].css("background-color") == "rgb(144, 238, 144)") && ((i != 0) && (floor[i - 1].css("background-color") == "rgb(97, 97, 97)"))) {
            floor[i - 1].css("background-color", "rgb(144, 238, 144)");
            floor[i].css("background-color", "rgb(65, 65, 65)");
        }
        if ((floor[0].css("background-color") == "rgb(144, 238, 144)") && (floor[1].css("background-color") == "rgb(97, 97, 97)")) {
            floor[0].css("background-color", "rgb(65, 65, 65)");
            $("#box").val(String(score += points) + " Points");
        } else if ((floor[0].css("background-color") == "rgb(144, 238, 144)") && (floor[1].css("background-color") == "rgb(65, 65, 65)")) {
            floor[0].css("background-color", "rgb(97, 97, 97)");
            $("#box").val(String(score += points) + " Points");
        }
    }
    //removeGaps();
}

function hit() {
    if ((floor[2].css("background-color") == "rgb(144, 238, 144)") && (parseInt($("#player").css("top").replace("px", "")) == H - scl * 2)) {
        timerOn = 0;
        clearTimeout(timer);
        clearInterval(moveFloorTimer);
        can.append("<h1 id='lose' style='color: orange'>YOU LOSE</h1>");
        var L = $("#lose");
        L.css("position", "absolute");
        L.css("left", W/3 + 30);
        L.css("top", H/3);
        L.css("font-family", "'Open Sans', sans-serif");
    }
}

function removeGaps() {
    // if ($("#gap") && gapsArr[0]) {
    // if (parseInt(gapsArr[0].css("left").replace("px", "")) <= 0) {
    // gapsArr[0].remove();
    //gapsArr.shift();
    // }
    // for (i = gapsArr.length - 1; i >= 0; i--) {
    // for (i = 0; i <= gapCount; i++) {
    // var G = $("#gap" + i);
    // var temp = parseInt(G.css("left").replace("px", "")) - scl;
    // G.css("left", temp);
    // if (temp <= 0 - scl) {
    // G.remove();
    //gapsArr.splice(i, 1);
    // gapsArr.shift();
    // }
    // }
    // }

}

function redGap() {
    /*    if (gapCount > 5) {
            gapCount = 0;
        }
        if ($("#gap") && gapsArr[0]) {
            if (parseInt(gapsArr[0].css("left").replace("px", "")) <= 0) {
                gapsArr[0].remove();
                //gapsArr.shift();
            }
        }
        can.append("<div id='gap" + gapCount + "'></div>");
        var G = $("#gap" + gapCount);
        gapsArr.push(G);
        G.css("width", scl);
        G.css("height", scl);
        G.css("background-color", "lightgreen");
        G.css("position", "absolute");
        G.css("left", W - scl);
        G.css("top", H - scl);
        G.css("padding", "0");
        G.css("margin", "0");
        G.css("z-index", "5");
        gapCount += 1;*/
    if (floor[floor.length - 1].css("background-color") != "rgb(144, 238, 144)") {
        floor[floor.length - 1].css("background-color", "lightgreen");
    }
}

function fall(obj) {
    velo += grav;
    var temp = parseInt(obj.css("top").replace("px", "")) + velo;
    obj.css("top", temp);
    if (temp + velo + grav >= H - scl * 2) {
        obj.css("top", H - scl * 2);
        velo = 0;
    }
}

function jump(obj) {
    var temp = parseInt(obj.css("top").replace("px", ""));
    if (temp === H - scl * 2) {
        jumpVelo = 10;
        jumpTimerCount = 0;
        timerOn = 0;
        clearTimeout(timer);
        jumpTimer = window.setInterval(function () { jumpTest(obj); }, 20);
        // jumpTimer = window.setTimeout(jumpTest.bind(this, obj), 17);
    }
}

function jumpTest(obj) {
    var temp = parseInt(obj.css("top").replace("px", ""));
    jumpVelo -= jumpForce;
    temp -= jumpVelo;
    obj.css("top", temp);
    jumpTimerCount += 1;
    if (jumpTimerCount >= 30) {
        clearInterval(jumpTimer);
        timerOn = 1;
        run();
    }
}

function box(){
    can.append("<input id='box' disabled type='text' value='SPACE TO JUMP!' />");
    var B = $("#box");
    B.css("position", "absolute");
    B.css("left", W + 50);
    B.css("padding", 0);
    B.css("margin", 0);
    B.css("background-color", "white");
    B.css("height", "50px");
    B.css("width", "250px");
    B.css("font-size", "24px");
    B.css("text-align", "center");
    B.css("font-family", "'Open Sans', sans-serif");
}

function setup() {
    playerSpawn();
    spawnFloor();
    moveFloor();
    box();
}

function moveFloor() {
    moveFloorTimer = window.setInterval("gaps();", 300);
}

function run() {
    if (timerOn) {
        if (parseInt($("#player").css("top").replace("px", "")) < H - scl) {
            fall($("#player"));
        }
        if (timer % 100 == 0) {
            redGap();
        }
        hit();
        timer = window.setTimeout("run();", 20);
    }
}