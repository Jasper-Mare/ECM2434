//=========================================================
//===================== CANVAS SET-UP =====================
//#region canvas_setup
const canvas = document.querySelector("canvas");
window.scrollTo({ top: 0, behavior: "auto" });
document.body.style.overflow = "hidden";

// internal canvas space dimenesions
const canvasDims = { width: 1200, height: 740 };
canvas.width = canvasDims.width;
canvas.height = canvasDims.height;

// - 2d context
const ctx = canvas.getContext("2d");
//#endregion

//=========================================================
//======================== UTILITY ========================
//#region utility
// dynamic screen fit
function debounce(func, wait) {
    let timeout;
    return function () {
        const context = this;
        const args = arguments;
        const later = function () {
            timeout = null;
            func.apply(context, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
function resizeCanvas() {
    // Get dimensions of the window
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;

    // Account for any UI elements that reduce available space
    //let navbarHeight = document.querySelector('.navbar').offsetHeight;
    let navbarHeight = 100;
    let topOffset = navbarHeight + 100;
    let scrollbarWidth = window.innerWidth - document.documentElement.clientWidth + 20;

    // Calculate available canvas dimensions
    let availableWidth = windowWidth - scrollbarWidth;
    let availableHeight = windowHeight - topOffset;

    // Calculate aspect ratio of the canvas
    let aspectRatio = canvasDims.width / canvasDims.height;

    // Calculate dimensions of the canvas
    let canvasWidth = availableWidth;
    let canvasHeight = availableWidth / aspectRatio;

    // If canvas height is too big for the window, adjust canvas dimensions again
    if (canvasHeight > availableHeight) {
        canvasHeight = availableHeight;
        canvasWidth = canvasHeight * aspectRatio;
    }

    // Set canvas dimensions
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Set scale for drawing context
    let scaleX = canvasWidth / canvasDims.width;
    let scaleY = canvasHeight / canvasDims.height;
    ctx.scale(scaleX, scaleY);
}
window.addEventListener("resize", debounce(resizeCanvas, 250));

function lerp(startValue, endValue, t) {
    return startValue + (endValue - startValue) * t;
}

function screenToWorldSpace(x, y) {
    // screen space 0 to 1 on width and height
    // world space = canvas space
    const xWorld = lerp(0, canvasDims.width, x);
    const yWorld = lerp(0, canvasDims.height, y);

    return [xWorld, yWorld];
}
//#endregion

//========================================================
//=================== INPUT MANAGEMENT ===================
//#region input_management
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    var scaleX = canvasDims.width / rect.width;
    var scaleY = canvasDims.height / rect.height;

    return {
        x: (evt.clientX - rect.left) * scaleX,
        y: (evt.clientY - rect.top) * scaleY
    };
}
canvas.addEventListener("mousemove", (e) => {
    GLOBALS.mousePosition = getMousePos(canvas, e);
})
canvas.addEventListener("click", (e) => {
    switch (e.button) {
        case 0:
            for (const ui of UI_FLOAT) {
                if (ui.isZoomed) {
                    ui.onClick();
                }
            }
            if (gameIsPaused) {
                return;
            }
            for (const ui of UI) {
                if (ui.isZoomed) {
                    ui.onClick();
                }
            }
            for (const card of CARDS) {
                if (card.isHovered) {
                    card.onClick();
                }
            }
            break;
        default:
            break;
    }
});
//#endregion

//========================================================
//================== RENDERING PIPELINE ==================
//#region rendering_pipeline

//----------------------------------------------------
//------------------ OBJECT SPRITES ------------------
//#region object sprites
class UIButton {
    constructor(coords, dims, zDims, onClickFunction, text = "", color = "#f49d37") {
        this.anchor = { x: coords[0], y: coords[1] };
        this.offset = { x: 0, y: 0 };
        this.originalDims = { w: dims[0], h: dims[1] };
        this.currentDims = { w: dims[0], h: dims[1] };
        this.zoomedDims = { w: zDims[0], h: zDims[1] }
        this.isZoomed = false;
        this.text = text;

        this.zoomInAnimRunning = false;
        this.zoomOutAnimRunning = false;

        this.AnimCounter = { zoomIn: 0, zoomOut: 0 };

        this.onClickFunction = onClickFunction;
        this.extraData = 0;

        this.color = color;
    }

    //animations
    zoomInAnim(speed = 20) {
        if (this.AnimCounter.zoomIn < 1) {
            this.currentDims.w = lerp(this.originalDims.w, this.zoomedDims.w, this.AnimCounter.zoomIn);
            this.currentDims.h = lerp(this.originalDims.h, this.zoomedDims.h, this.AnimCounter.zoomIn);
            this.offset.x = (this.originalDims.w - this.currentDims.w) / 2;
            this.offset.y = (this.originalDims.h - this.currentDims.h) / 2;
            this.AnimCounter.zoomIn += speed * deltaTime.get('delta');
        } else {
            this.AnimCounter.zoomIn = 0;
            this.zoomInAnimRunning = false;
        }
    }

    zoomOutAnim(speed = 20) {
        if (this.AnimCounter.zoomOut <= 1) {
            this.currentDims.w = lerp(this.zoomedDims.w, this.originalDims.w, this.AnimCounter.zoomOut);
            this.currentDims.h = lerp(this.zoomedDims.h, this.originalDims.h, this.AnimCounter.zoomOut);
            this.offset.y = (this.originalDims.h - this.currentDims.h) / 2;
            this.offset.x = (this.originalDims.w - this.currentDims.w) / 2;
            this.AnimCounter.zoomOut += speed * deltaTime.get('delta');
        } else {
            this.AnimCounter.zoomOut = 0;
            this.zoomOutAnimRunning = false;
        }
    }

    onClick() {
        if (!updateLimiter) {
            this.onClickFunction(this.extraData);
            updateLimiter = true;
        }
    }

    // object management
    update() {
        // hovering over the button
        var xBound = GLOBALS.mousePosition.x >= this.anchor.x + this.offset.x && GLOBALS.mousePosition.x <= this.anchor.x + this.offset.x + this.currentDims.w;
        var yBound = GLOBALS.mousePosition.y >= this.anchor.y + this.offset.y && GLOBALS.mousePosition.y <= this.anchor.y + this.offset.y + this.currentDims.h;
        if (xBound && yBound) {
            if (!this.zoomInAnimRunning && !this.isZoomed) {
                this.isZoomed = true;
                this.zoomInAnimRunning = true;
            }
        } else if (this.isZoomed) {
            this.isZoomed = false;
            this.zoomOutAnimRunning = true;
        }
    }
    render() {
        //update behaviour
        this.update();
        //run animations
        if (this.zoomInAnimRunning) {
            this.zoomInAnim();
        }
        if (this.zoomOutAnimRunning) {
            this.zoomOutAnim();
        }

        //draw sprite to canvas
        var x = this.anchor.x + this.offset.x;
        var y = this.anchor.y + this.offset.y;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.roundRect(x, y, this.currentDims.w, this.currentDims.h, 10);
        ctx.fill();
        ctx.font = "30px 'Courier new'";
        ctx.fillStyle = "black";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillText(this.text, x + this.currentDims.w / 2, y + this.currentDims.h / 2);
    }
}

class UIText {
    constructor(coords, fontSize, font, color, text, styling = "", alignBase = "top", align = "left") {
        this.coords = { x: coords[0], y: coords[1] };
        this.fontSize = fontSize;
        this.font = font;
        this.color = color;
        this.text = text;
        this.styling = styling;
        this.alignBase = alignBase;
        this.align = align;
    }
    render() {
        ctx.font = this.styling + this.fontSize + "px" + this.font;
        ctx.fillStyle = this.color;
        ctx.textBaseline = this.alignBase;
        ctx.textAlign = this.align;
        ctx.fillText(this.text, this.coords.x, this.coords.y);
    }
}

class UIRect {
    constructor(coords, dims, color, cornerRadii = 10) {
        this.anchor = { x: coords[0], y: coords[1] };
        this.dims = { w: dims[0], h: dims[1] };
        this.color = color;
        this.radii = cornerRadii;
    }
    render() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.roundRect(this.anchor.x, this.anchor.y, this.dims.w, this.dims.h, this.radii);
        ctx.fill();
    }
}
//#endregion

//-----------------------------------------------------
//------------------ FRAME RENDERING ------------------
//#region frame rendering

//#endregion
//#endregion

// Game logic

// Music