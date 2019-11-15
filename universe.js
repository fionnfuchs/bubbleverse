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

    setInterval(asyncUpdate, 33);

    //setInterval(spawnRandomBubble, 1000);
}

function asyncUpdate() {
    for(b of bubbles) {
        updateBubble(b);
    }
}

function draw() {
    updateDeltaTimes();
    updateAchievements();

    clear();
    background(20);
    if(bubbles.length > 0) {
        for(b of bubbles) {
            drawAttractionRadiusStroke(b);
        }
    
        for(b of bubbles) {
            drawBubble(b);
        }
    }
    
    // bubbles.sort(function(a,b) { // If graphics settings?
    //     return a.score - b.score;
    // })
    drawUniverseBorder();
    drawUinversePopulation();
    drawVersionText();
    drawMaxBubbleSizeText();
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
            //console.log(VALUES.currency);
        }
    }
}

function spawnRandomBubble() {
    if(bubbles.length < MODIFIERS.bubble.maxBubbleNumber) {
        addBubble(random(universeArea.w), random(universeArea.h), MODIFIERS.bubble.startingValue);
    }
}

function collectRandomBubble() {
    if(bubbles.length >= 1) {
        var randomIndex = Math.round(random(bubbles.length-1));
        if(randomIndex<0)randomIndex=0;
        let b = bubbles[randomIndex];
        bubbles.splice(randomIndex,1);
        STATISTICS.total.collectedValue += calculateBubbleValue(b.score);
        VALUES.currency += calculateBubbleValue(b.score);
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
                if(b.score < getMaxScore() || b2.score < getMaxScore()) {
                    diff.normalize();
                    diff.mult(sqrt(b2.size));
                    diff.mult(2);
                    diff.div(distance+1);
                    toMove = p5.Vector.add(toMove, diff);
                }

                //Check if overlap
                if(distance < b.size/2 + 6) {
                    b.score += b2.score;
                    b.score += calculateJoinBonus(b.score);
                    if(b.score > getMaxScore()) {
                        b.score = getMaxScore();
                    }
                    bubbles.splice(i,1);
                    collectMergeBonus();
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
    fill(0,0,0,0);
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
    let maxSize = 50*MODIFIERS.universe.factor_size;
    let percentage = s/MODIFIERS.bubble.maxValue;
    let size = percentage*maxSize;
    if(size < 6) {
        size = 6;
    }
    return size;
}

function calculateBubbleValue(score) {
    let value = score*VALUES.globalMultiplier;
    if(value > MODIFIERS.bubble.maxValue) {
        value = MODIFIERS.bubble.maxValue;
    }
    return Math.round(value);
}

function getMaxScore () {
    return MODIFIERS.bubble.maxValue/VALUES.globalMultiplier;
}

function calculateAttractionRadius(size) {
    return (MODIFIERS.physic.base_attractionRadius+size+UPGRDATA.attractionRadius.value(VALUES.upgradeLevel.attractionRadius))*MODIFIERS.physic.factor_attractionRadius;
}

function calculateJoinBonus(score) {
    return score * MODIFIERS.physic.mergeGrowth;
}

function drawUinversePopulation() {
    fill(250);
    textSize(12);
    noStroke();
    textAlign(CENTER);
    textFont('Courier');
    text("Population: " + bubbles.length + "/" + MODIFIERS.bubble.maxBubbleNumber,256,15);
}

function drawVersionText() {
    fill(250);
    textSize(12);
    noStroke();
    textAlign(LEFT);
    textFont('Courier');
    text("bubbleverse v" + GENERAL.version,0,500);
}

function drawMaxBubbleSizeText() {
    fill(250);
    textSize(12);
    noStroke();
    textAlign(CENTER);
    textFont('Courier');
    text("Max. bubble size: " + MODIFIERS.bubble.maxValue,256,29);
}

function collectMergeBonus() {
    VALUES.currency += MODIFIERS.physic.mergeBonus;
    //Spawn a particle?
}