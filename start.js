import "./kaboom.js"



loadSprite("salt", "/sprites/salt.png")
loadSprite("stove", "/sprites/stove1.png")
loadSprite("floor", "/sprites/floor.png")
loadSprite("portal", "/sprites/portal.png")
loadSprite("ketchup", "/sprites/ketchup.png")
loadSprite("mustard", "/sprites/mustard.png")
loadSprite("children", "/sprites/child.png")
loadSprite("invis-wall", "sprites/wall.jpg")

loadSprite("bakery", "/sprites/bakery.jpg")

loadSprite("pretzel", "/sprites/pretzelstrip.png", {
    sliceX: 9,

    anims: {
        "idle": {
            from: 0,
            to: 0,
            loop: true,
        },
        "run": {
            from: 1,
            to: 8,
            loop: true,
            speed: 10,
        }
    }
}

)


//N means normal -- K means ketchuo --- M means mustard
const NSPEED = 480
const MSPEED = 600
let SPEED = NSPEED

const SPEEDC = 1200

const KJUMP = 800
const NJUMP = 650
let JUMP = NJUMP

let start1 = "true"
let INVINSIBLE = "false"


const CHILD_SPEED = 250

var death = ""
var checkpoint = 1
const UI_FONT = "monospace"
const FLOOR_SCALE = 0.62
const FLOOR_COLLIDER_WIDTH = 104 * FLOOR_SCALE
const FLOOR_COLLIDER_HEIGHT = 121 * FLOOR_SCALE
const PLAYER_BODY_WIDTH = 28
const PLAYER_BODY_HEIGHT = 18
const PLAYER_SPRITE_SCALE = 1.1


const LEVELS = [
    [
        "=                                            =       =",
        "=@         ^     =|+ |  $$$$$     ,       .  =     > =",
        "======================================================",

    ],
    [
        "                     $     ,                             ",
        "                =    =                                   ",
        " @      ^   $  =|+          |  $   ^^   $       $    >   ",
        "===  ==== ========   =====================    ===========",
    ],

    [
        "                 .                                       =",
        "=             =   =   =                  =               =",
        "=@  |^ $$ +^|= |  + $   |   + ^^   |$  =    $ |    +  |, =",
        "======================================================   =",
        "                                                        ==",
        "                                                       = =",
        "  >  |  +  |    +    | ^^^ +     |    +  |  +  +     |=  =",
        "==========================================================",
    ],
    [
        "=             $=           =                             =",
        "=@ |+  | +  | =.  ^^^ $ ^   |     + + + |   ^$^          =",
        "================================================   ==    =",
        "   =               =                            =  =    ==",
        "  >=                                                   = =",
        "     ^^|$ +  |  +  + ^^ $^^  +  ^ +   |   +  |,       =  =",
        "=================================================  ===   =",

    ],
    [
        "=       $    =      =      =======.                       ",
        "= ,     =                        =                        ",
        "= =                            =                       >  ",
        "=    =                  =      =                      === ",
        "=       ==         =         = =  =         =      $      ",
        "=             =           =                       =       ",
        "=                       =        =                        ",
        "=           $       =              $            =         ",
        "=@   $      =   =                  =                      ",
        "==   =   =                                  ====          ",
    ],
    //HARD LEVEL no room for this though :( to many levels
    // [  
    // "        ^ ^ ^$^===| +++  ^    +  +    +   |  ^         =",
    // "      =========   =============================        =",
    // " =                                              =      =",
    // "   =| +  |^ $ + ^  + |    $ ^      ^             =    =",
    // "========================   =====   ===            =    =",
    // "=                                      =          =    =",
    // "=                                        =        =    =",
    // "=                            .             =      =    =",
    // "=                          ^^=^^ ^^^$^^^ ^  =     =    =",
    // "=          =     =     =======================    =    =",
    // "=     =                                       =   =    =",
    // "=@ =    |    ^+     |^    ^  ^    |$ +   +  |   ,= = > =",
    // "========================================================",
   
    // ],
]

scene("game", ({ levelIdx = 0, score = 0 } = {}) => {
    const currentLevelIdx = Math.max(0, Math.min(levelIdx, LEVELS.length - 1))
    const tileWidth = 64
    const tileHeight = 64
    const levelOrigin = vec2(100, 200)
    const currentLevel = LEVELS[currentLevelIdx]
    const spawnRow = currentLevel.findIndex((row) => row.includes("@"))
    const spawnCol = spawnRow >= 0 ? currentLevel[spawnRow].indexOf("@") : 0
    const levelLayout = currentLevel.map((row) => row.replace("@", " "))

    function spawnStaticCollider(col, row, tag) {
        const isFloor = tag === "floor"
        add([
            rect(
                isFloor ? FLOOR_COLLIDER_WIDTH : tileWidth,
                isFloor ? FLOOR_COLLIDER_HEIGHT : tileHeight,
            ),
            pos(
                levelOrigin.x + col * tileWidth,
                isFloor
                    ? levelOrigin.y + (row + 1) * tileHeight
                    : levelOrigin.y + row * tileHeight,
            ),
            anchor(isFloor ? "botleft" : "topleft"),
            area(),
            body({ isStatic: true }),
            opacity(0),
            tag,
        ])
    }

    var background = (x, y) => {
        add([

            scale(1.9),
            sprite("bakery"),
            pos(x, y),
            area(),
        ])
    }
    background(-500, -70)
    background(1000, -70)
    background(2500, -70)
    background(4000, -70)


    if (currentLevelIdx == 0) {
        add([
            pos(0, 0),

            text("Ah yes you have awoken. Due to your horrible karma in your previous life, you have been reborn as a sentient pretzel. Your objective is to escape the haunted bakery, which could be your grave, while saving your salt friends from this haunted place.", {
                width: 600,
                size: 12,
                font: UI_FONT,
            }),
        ])

        add([
            pos(-250, 50),
            text("GOD MODE! Press 'c' to go into god mode. In god mode you can fly, move faster, be invincible, explore the level, and switch between different levels. The keys are up, left, right, and down arrows which makes you move resectivly. Press 'r' to move onto the next level and 't' to go back a level. If you would like to swtich back into normal mode, press 's'. To go into invinsible mode while keeping survival controls press 'i', to become mortal again press 'l'. * note you cannot skip the tutorial using 'r'.", {
                width: 275,
                size: 15,
                font: UI_FONT,
            })
        ])

        add([
            pos(250, 75),
            text("TUTORIAL",{
                size: 12,
                font: UI_FONT,}
                )
            
        ])

        add([
            pos(200, 100),
            text("press the right arrow key to move right.",{
                size: 12,
                font: UI_FONT,})
        ])

        add([
            pos(200, 125),
            text("press the left arrow key to move left.",{
                size: 12,
                font: UI_FONT,})
        ])


        add([
            pos(200, 150),
            text("Press the space key in order to jump",{
                size: 12,
                font: UI_FONT,})
        ])

        add([
            pos(600, 100),
            text("This is a furnace. Make sure not to touch it or you will burn to death! Jump over the furnace in order to dodge it", {
                width: 400,
                size: 12,
                font: UI_FONT,
            })
        ])

        add([
            pos(1100, 100),
            text("AAAHH, its a child! Did you know 96% of pretzel fatalities are due to small children. Dodge the hungry evil spooky beasts in order to live.", {
                width: 400,
                size: 12,
                font: UI_FONT,
            })
        ])

        add([
            pos(1600, 100),
            text("These are your salt friends. In order to leave the bakery you must collect all the salt. Make sure to not leave anyone behind: it's bad luck!", {
                width: 400,
                size: 12,
                font: UI_FONT,
            })
        ])

        add([
            pos(2100, 100),
            text("This is the mustard powerup. Collect it in order to gain a boost in speed.", {
                width: 400,
                size: 12,
                font: UI_FONT,
            })
        ])

        add([
            pos(2600, 100),
            text("This is the ketchup powerup. Collect it in order to boost your jump height.", {
                width: 400,
                size: 12,
                font: UI_FONT,
            })
        ])

        add([
            pos(3100, 100),
            text("Touch the portal to escape the bakery. Remeber, you need to collect all your salt friends!", {
                width: 400,
                size: 12,
                font: UI_FONT,
            })
        ])
    }





    // Use the level passed, or first level
    addLevel(levelLayout, {
        tileWidth,
        tileHeight,
        pos: levelOrigin,
        tiles: {
            "=": () => [
                sprite("floor"),
                scale(FLOOR_SCALE),
                anchor("bot"),
                "floor",
            ],
            "$": () => [
                sprite("salt"),
                scale(.175),
                pos(0, -10),
                area(),
                anchor("bot"),
                "coin",
            ],
            "^": () => [
                sprite("stove"),
                scale(.2),
                area({
                    width: 142,
                    height: 100,
                }),
                pos(0, -10),
                anchor("bot"),
                "danger",
                "stove",
            ],
            ">": () => [
                sprite("portal"),
                scale(.4),
                pos(0, -5),
                area(),
                anchor("bot"),
                "portal",
            ],
            ".": () => [
                sprite("ketchup"),
                scale(.45),
                pos(0, -10),
                area(),
                anchor("bot"),
                "power",
                "ketchup",
            ],
            ",": () => [
                sprite("mustard"),
                scale(.45),
                pos(0, -10),
                area(),
                anchor("bot"),
                "power",
                "mustard",
            ],
            "+": () => [
                sprite("children"),
                scale(.15),
                area({
                    width: 120,
                    height: 275,
                }),
                pos(0, -10),
                anchor("bot"),
                "children",
                "danger",
                {
                    speed: CHILD_SPEED,
                },
            ],
            "|": () => [
                sprite("invis-wall"),
                scale(.3),
                anchor("bot"),
                opacity(.1),
                "invis-wall",
            ],
        },
    })

    currentLevel.forEach((rowText, row) => {
        ;[...rowText].forEach((tile, col) => {
            if (tile === "=" || tile === "|") {
                spawnStaticCollider(col, row, tile === "=" ? "floor" : "invis-wall")
            }
        })
    })



    const player = add([
        rect(PLAYER_BODY_WIDTH, PLAYER_BODY_HEIGHT),
        pos(
            levelOrigin.x + spawnCol * tileWidth + tileWidth / 2,
            levelOrigin.y + (spawnRow + 1) * tileHeight,
        ),
        area(),
        body(),
        anchor("bot"),
        opacity(0),
        "player",
    ])

    const playerSprite = player.add([
        sprite("pretzel"),
        scale(PLAYER_SPRITE_SCALE),
        anchor("bot"),
        pos(0, 0),
    ])

    playerSprite.play("idle")


    onKeyPress("r", () => {
        if (INVINSIBLE == "true" && currentLevelIdx > 0 && currentLevelIdx < LEVELS.length - 1) {
            JUMP = NJUMP
            SPEED = NSPEED
            checkpoint = Math.min(checkpoint + 1, LEVELS.length - 1)
            go("game", {
                levelIdx: currentLevelIdx + 1,
                score: 0,
            })

        }
    })

    onKeyPress("t", () => {
        if (INVINSIBLE == "true" && currentLevelIdx > 1) {
            JUMP = NJUMP
            SPEED = NSPEED
            checkpoint = Math.max(checkpoint - 1, 1)
            go("game", {
                levelIdx: currentLevelIdx - 1,
                score: 0,
            })

        }
    })

    onKeyPress("i", () => {
        INVINSIBLE = "true"
    })

    onKeyPress("l", () => {
        INVINSIBLE = "false"
    })

    let leftControl = null
    let rightControl = null
    let spaceControl = null
    let upControl = null
    let downControl = null

    function clearMovementControls() {
        leftControl?.cancel()
        rightControl?.cancel()
        spaceControl?.cancel()
        upControl?.cancel()
        downControl?.cancel()
        leftControl = null
        rightControl = null
        spaceControl = null
        upControl = null
        downControl = null
    }

    function registerNormalControls() {
        clearMovementControls()

        spaceControl = onKeyPress("space", () => {
            if (player.isGrounded()) {
                player.jump(JUMP)
            }
        })

        leftControl = onKeyDown("left", () => {
            player.move(-SPEED, 0)
            playerSprite.flipX = true

            if (playerSprite.curAnim() !== "run") {
                playerSprite.play("run")
            }
        })

        rightControl = onKeyDown("right", () => {
            player.move(SPEED, 0)
            playerSprite.flipX = false
            if (playerSprite.curAnim() !== "run") {
                playerSprite.play("run")
            }
        })
    }

    function registerGodModeControls() {
        clearMovementControls()

        leftControl = onKeyDown("left", () => {
            player.move(-SPEEDC, 0)
        })

        rightControl = onKeyDown("right", () => {
            player.move(SPEEDC, 0)
        })

        downControl = onKeyDown("down", () => {
            player.move(0, SPEEDC)
        })

        upControl = onKeyDown("up", () => {
            player.move(0, -SPEEDC)
        })
    }



    // Initial Set up idk how to get this to work without it
    if (start1 == "true") {
        setGravity(2400)
        INVINSIBLE = "false";
        registerNormalControls()
    }

    onKeyRelease(["left", "right"], () => {
        if (!isKeyDown("left") && !isKeyDown("right") && playerSprite.curAnim() !== "idle") {
            playerSprite.play("idle")
        }
    })

    // Movements


    onKeyPress("s", () => {
        setGravity(2400)
        INVINSIBLE = "false"
        registerNormalControls()
    })

    //creative
    onKeyPress("c", () => {
        setGravity(0)
        INVINSIBLE = "true"
        registerGodModeControls()
        player.move(0, -100)

    })


    player.onCollide("ketchup", (power) => {
        destroy(power)
        JUMP = KJUMP
    })

    player.onCollide("mustard", (power) => {
        destroy(power)
        SPEED = MSPEED
    })



    player.onCollide("children", () => {
        if (INVINSIBLE == "false") {
            go("lose")
            death = "You have been gobbled up by a child"
        }
    })

    player.onCollide("stove", () => {
        if (INVINSIBLE == "false") {
            go("lose")
            death = "You have burned in the inferno humans call stove"
        }
    })




    player.onCollide("coin", (coin) => {
        destroy(coin)

        score++
        scoreLabel.text = score
    })

    onUpdate('children', (s) => {
        s.move(s.speed, 0)

    })
    onCollide("children", 'invis-wall', (s) => {
        s.speed = s.speed * -1
    })

    player.onUpdate(() => {
        if (player.pos.y >= 2000) {
            death = "You fell. Didn't even die to a mob. This right here is emotional damage"
            go("lose")
        }
    })
    

    // Enter the next level on portal
    player.onCollide("portal", () => {
        //take out the if score <5 STATEMENT and else if score >=5 for original
        if (score < 5) {
            death = "Bad luck! You left a salt friend behind, you died from EMOTIONAL DAMAGE..."
            go("lose")
        }
        else if (score >= 5) {
            if (currentLevelIdx < LEVELS.length - 1 && currentLevelIdx != 0) {
                // If there's a next level, go() to the same scene but load the next level
                SPEED = NSPEED,
                    JUMP = NJUMP,
                    
                    checkpoint = Math.min(checkpoint + 1, LEVELS.length - 1)
                    

                    go("game", {
                        levelIdx: currentLevelIdx + 1,
                        score: 0,
                    })
            } else if (currentLevelIdx < 1) {
                SPEED = NSPEED,
                JUMP = NJUMP,
                    go("game", {
                        levelIdx: currentLevelIdx + 1,
                        score: 0,
                    })
            }else 
                // Otherwise we have reached the end of game, go to "win" scene!
                go("win", { score: score, })
            
        }
    })

    //camera follows player
    player.onUpdate(() => {
        camPos(player.pos)
    })

    const scoreLabel = add([
        text(score),
        pos(player.pos.x, 200)
    ])
    // Score counter text


})




scene("lose", () => {



    add([
        text(death + ". Press 'space' to respawn or 'p' to go do Tutorial", {
            size: 50,
            font: UI_FONT,
            width: 1000,
        }),
        pos(200, 200),
    ])
    // Press any key to go back
    onKeyPress("space", respawn)
    onKeyPress("p", tut)

})

scene("win", () => {

    add([
        text(`You have sucessfully managed to escape the haunted bakery with the evil children and stoves. Congratulations!!! Press any key to restart.`, {
            width: 900,
            size: 50,
        }),
        pos(650, 300),
        anchor("center"),
        color(300,300,100),
    ])

    onKeyPress(start)

})

function start() {
    // Start with the "game" scene, with initial parameters
    SPEED = NSPEED,
        JUMP = NJUMP,
        go("title", {
            score: 0,
        })
}

function respawn() {
    // Start with the "game" scene, with initial parameters
    SPEED = NSPEED,
        JUMP = NJUMP,

     
        go("game", {
            levelIdx: Math.max(1, Math.min(checkpoint, LEVELS.length - 1)),
            score: 0,
        })
      
}

function tut() {
    // Start with the "game" scene, with initial parameters
       
        go("game", {
            levelIdx: 0,
            score: 0,
        })
       
        checkpoint = 1
        SPEED = NSPEED
        JUMP = NJUMP    
    
}

//We moved our title scene here b/c import from main doesn't work for some reason on this neo cities

scene("title", () => {
    addButton("Start", vec2(650,300), () => go('game', {levelIdx: 1, score: 0,}))
    addButton("Tutorial", vec2(650,350), () => go('game', {levelIdx: 0, score: 0}) )
	add([
		pos(650, 150),
		anchor("center"),
		color(300,100,200),
		text("Pretzel Escape", {
			size: 100,
			font: UI_FONT,
		})
	])

	add([
		sprite("pretzel"),
		scale(3),
		anchor("center"),
		pos(650, 500),
		"beggining",

	])

	const player = get("beggining")[0]
	const SPEED = 150
	onDraw(()=> {
		if(player.curAnim() !== "run"){
            player.play("run")
        }
		player.move(SPEED,0)
		if (player.pos.x >= 1350){
			player.pos.x = 0
		}
	
	})
	
})


function addButton(txt, p, f) {

	const btn = add([
		text(txt,{
            font: UI_FONT,
            size: 30,


        }),
		pos(p),
		area({ cursor: "pointer", }),
		scale(1),
		anchor("center"),
	])

	btn.onClick(f)

	btn.onUpdate(() => {
		if (btn.isHovering()) {
			const t = time() * 10
			btn.color = rgb(
				wave(0, 255, t),
				wave(0, 255, t + 2),
				wave(0, 255, t + 4)
			)
			btn.scale = vec2(1.2)
		} else {
			btn.scale = vec2(1)
			btn.color = rgb(255, 255, 255)
		}
	})

}

start()
