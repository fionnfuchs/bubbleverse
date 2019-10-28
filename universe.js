var bubbles = [];

var universeArea = {
    x: 0,
    y: 0,
    w: 128,
    h:128,
}

function preload() {
    //Load cookie save file
    INIT();
    loadFromCookie();
    calculateTempValues();
}

//P5 JS main functions
function setup() {
    universeArea.w = 512/4*MODIFIERS.universe.factor_size;
    universeArea.h = 512/4*MODIFIERS.universe.factor_size;
    universeArea.x = 256 - universeArea.w/2;
    universeArea.y = 256 - universeArea.h/2;


    frameRate(30);
    let canvas = createCanvas(UNIVERSE.size, UNIVERSE.size);
    if(SETTINGS.webgl) {
        canvas = createCanvas(UNIVERSE.size, UNIVERSE.size, WEBGL);
    }
    
    canvas.parent("p5_canvas_container");
    spawnRandomBubble();

    //setInterval(spawnRandomBubble, 1000);
}

function draw() {
    updateDeltaTimes();

    clear();
    background(20);

    for(b of bubbles) {
        drawAttractionRadiusStroke(b);
    }
    for(b of bubbles) {
        updateBubble(b);
    }
    for(b of bubbles) {
        drawBubble(b);
    }
    // bubbles.sort(function(a,b) { // If graphics settings?
    //     return a.score - b.score;
    // })
    drawUniverseBorder();
    drawUinversePopulation();
}

function mouseClicked () {
    //spawnRandomBubble();
    for(let i = 0; i < bubbles.length; i++) {
        let b = bubbles[i];
        let mouseV = createVector(mouseX,mouseY);
        let dist = mouseV.dist(b.position);
        
        if(dist < b.size+8) {
            bubbles.splice(i,1);
            // Collect Statistics 
            STATISTICS.total.collectedBubbles++;
            STATISTICS.total.collectedValue += calculateBubbleValue(b.score);

            VALUES.currency += calculateBubbleValue(b.score);
            console.log(VALUES.currency);
        }
    }
}

function spawnRandomBubble() {
    if(bubbles.length < MODIFIERS.bubble.maxBubbleNumber) {
        addBubble(random(universeArea.w), random(universeArea.h), MODIFIERS.bubble.startingValue);
    }
}

//Bubble adding
function addBubble(x,y,size) {
    bubbles.push({
        position: createVector(universeArea.x+x,universeArea.y+y),
        score: size,
        size: 0,
        displaySize: 0,
    });
}

//Logic
function updateBubble(b) {
    let toMove = createVector(0,0);

    b.size = calculateBubbleSize(b.score);
    
    for(let i = 0; i < bubbles.length; i++) {
        let b2 = bubbles[i];
        if(b !== b2) {
            let diff = p5.Vector.sub(b2.position,b.position);
            let distance = b.position.dist(b2.position);
            if(distance < calculateAttractionRadius(b2.displaySize) / 2) {
                diff.normalize();
                diff.mult(sqrt(b2.size));
                diff.mult(2);
                diff.div(distance+1);
                toMove = p5.Vector.add(toMove, diff);

                push();
                strokeWeight(1);
                stroke(240);
                //line(b.position.x,b.position.y,b2.position.x,b2.position.y); If line upgrade (very expensive)

                //Check if overlap
                if(distance < b.size/2 + 6) {
                    b.score += b2.score;
                    b.score += calculateJoinBonus(b.score);
                    bubbles.splice(i,1);
                }
            }
        }
    }
    toMove.mult(MODIFIERS.physic.factor_generalSpeed);
    b.position = p5.Vector.add(b.position, toMove);

    b.size = calculateBubbleSize(b.score);
    //Adjust size gradually for polishing
    if(b.displaySize < b.size) {
        b.displaySize += (b.size - b.displaySize) / 10;
    } else {
        b.displaySize = b.size;
    }
}



//Draw stuff

function drawAttractionRadius(b) {
    noStroke();
    fill(30);
    ellipse(b.position.x,b.position.y,calculateAttractionRadius(b.displaySize),calculateAttractionRadius(b.displaySize));
}

function drawAttractionRadiusStroke(b) {
    stroke(40);
    strokeWeight(1);
    fill(0,0,0,0);
    ellipse(b.position.x,b.position.y,calculateAttractionRadius(b.displaySize),calculateAttractionRadius(b.displaySize));
}

function drawBubble(b) {
    push();
    strokeWeight(2);
    stroke(250);
    fill(77);
    ellipse(b.position.x,b.position.y,b.displaySize+8,b.displaySize+8);
    if(b.score >= 1) {
        fill(250);
        noStroke();
        textSize(8+b.size/8);
        textAlign(CENTER, CENTER);
        textFont('Courier');
        textStyle(BOLD);
        text(calculateBubbleValue(b.score), b.position.x,b.position.y);
    }
    pop();
}

function drawUniverseBorder() {
    push();
    strokeWeight(3);
    stroke(255);
    rect(universeArea.x,universeArea.y,universeArea.w,universeArea.h);
    noStroke();
    fill(15);
    rect(0,0,universeArea.x,512);
    rect(universeArea.x+universeArea.w,0,universeArea.x,512);
    rect(0,0,512,universeArea.y);
    rect(0,universeArea.h+universeArea.y,512,universeArea.y);
    pop();
}

function calculateBubbleSize(s) {
    let size = Math.log(0.01*s+1)*(512/4*MODIFIERS.universe.factor_size/4);
    if(size > (512/4*MODIFIERS.universe.factor_size/4)) {
        size = 512/4*MODIFIERS.universe.factor_size/4;
    }
    return size;
}

function calculateBubbleValue(score) {
    let value = score;
    if(value > MODIFIERS.bubble.maxValue) {
        value = MODIFIERS.bubble.maxValue;
    }
    return Math.round(value);
}

function calculateAttractionRadius(size) {
    return (MODIFIERS.physic.base_attractionRadius+size*2)*MODIFIERS.physic.factor_attractionRadius;
}

function calculateJoinBonus(score) {
    return score * 0.05;
}

function drawUinversePopulation() {
    fill(250);
    textSize(12);
    noStroke();
    textAlign(CENTER);
    textFont('Courier');
    text("Population: " + bubbles.length + "/" + MODIFIERS.bubble.maxBubbleNumber,256,15);
}