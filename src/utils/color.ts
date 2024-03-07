

type RGB = {
    r: number;
    g: number;
    b: number;
};

type HSL = {
    h: number;  // [0, 360] 色相 Hue
    s: number;  // [0, 1] 饱和度 Saturation
    l: number;  // [0, 1] 亮度 Lightness
};

type HSV = {
    h: number;
    s: number;
    v: number;
};

type HEX = 
    | "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
    | "A" | "B" | "C" | "D" | "E" | "F";

const RGBUnit = 255;

const HEX_MAP: Record<HEX, number> = {
    "0": 0,
    "1": 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "A": 10,
    "B": 11,
    "C": 12,
    "D": 13,
    "E": 14,
    "F": 15,
};

const HEX_MAP_REVERSE: Record<number, HEX> = {
    0: "0",
    1: "1",
    2: "2",
    3: "3",
    4: "4",
    5: "5",
    6: "6",
    7: "7",
    8: "8",
    9: "9",
    10: "A",
    11: "B",
    12: "C",
    13: "D",
    14: "E",
    15: "F",
};

const rgbWhite: RGB = { r: 255, g: 255, b: 255 };
const rgbBlack: RGB = { r: 0, g: 0, b: 0 };

/**
 * RGB 颜色转 HSL 颜色
 * https://www.zhihu.com/question/22077462
 * @param rgb {r: [0, 255], g: [0, 255], b: [0, 255]}
 * @returns {h: [0, 360], s: [0, 1], l: [0, 1]}
 */
function rgb2hsl(rgb: RGB): HSL {
    // 计算rgb基数 ∈ [0, 1]
    const r = rgb.r / RGBUnit;
    const g = rgb.g / RGBUnit;
    const b = rgb.b / RGBUnit;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    let h = 0;  // if delta == 0
    let s = 0;  // if l == 0 || max == min
    let l = (max + min) / 2;
    if (delta !== 0) {
        // if 0 < l <= 0.5: s = delta / 2l
        // if l > 0.5: s = delta / (2 - 2l)
        s = delta / (1 - Math.abs(2 * l - 1));  
        switch (max) {
            case r:
                h = (g - b) / delta + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / delta + 2;
                break;
            case b:
                h = (r - g) / delta + 4;
                break;
        }
        h *= 60;
    }
    return {
        h,
        s,
        l,
    };
}

/**
 * HSL 颜色转 RGB 颜色
 * @param hsl {h: [0, 360], s: [0, 1], l: [0, 1]}
 * @returns {r: [0, 255], g: [0, 255], b: [0, 255]}
 */
function hsl2rgb(hsl: HSL): RGB {
    const {h, s, l} = hsl
    h /= 360;   // 色相转换为 [0, 1]

    function hue2rgb(p: number, q: number, t: number) {
        // 保持 [0, 1] 环状取值
        if (t < 0) t += 1;
        if (t > 1) t -= 1;

        let colorValue = p;

        do{
            if (t < 1 / 6) {
                colorValue = p + (q - p) * 6 * t;
                break;            
            } 
            if (t < 1 / 2) {
                colorValue = q;
                break;
            }
            if (t < 2 / 3) {
                colorValue = p + (q - p) * (2 / 3 - t) * 6;
                break;
            }
        }while (0);

        return Number((colorValue * RGBUnit).toFixed(0));    // 去除小数部分
    }

    let r = 0;
    let g = 0;
    let b = 0;
    if (s === 0) {  // 饱和度为0，即灰色
        r = l * RGBUnit;
        g = l * RGBUnit;
        b = l * RGBUnit;
    } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return {
        r,
        g,
        b,
    };
}

/**
 * '#RRGGBB' -> RGB
 * @param hex 
 * @returns 
 */
function hex2rgb(hex: string): RGB {
    if (hex.length !== 7 || !/^#[0-9A-F]{6}$/.test(hex)) {
        throw new Error(`Invalid HEX color: ${hex}`);
    }

    hex = hex.toUpperCase();
    const r = HEX_MAP[hex[1]] * 16 + HEX_MAP[hex[2]];
    const g = HEX_MAP[hex[3]] * 16 + HEX_MAP[hex[4]];
    const b = HEX_MAP[hex[5]] * 16 + HEX_MAP[hex[6]];

    return {
        r,
        g,
        b,
    };
}

/**
 * RGB -> #RRGGBB
 * @param rgb 
 * @returns 
 */
function rgb2hex(rgb: RGB): string {
    const {r, g, b} = rgb;

    function toHex(value: number): HEX {
        const hex = HEX_MAP_REVERSE[value];
        if (hex === undefined) {
            throw new Error(`Invalid HEX value: ${value}`);
        }
        return hex;
    }

    function toHexPair(value: number): string {
        value = Math.round(value);
        return toHex(Math.floor(value / 16)) + toHex(value % 16);
    }

    return `#${toHexPair(r)}${toHexPair(g)}${toHexPair(b)}`;
}

function hsl2hex(hsl: HSL): string {
    return rgb2hex(hsl2rgb(hsl));
}

function hex2hsl(hex: string): HSL {
    return rgb2hsl(hex2rgb(hex));
}

type MixColor = {
    DEFAULT: string;

    dark: {
        1: string;
        2: string;
        3: string;
        4: string;
        5: string;
        6: string;
        7: string;
        8: string;
        9: string;
    };

    light: {
        1: string;
        2: string;
        3: string;
        4: string;
        5: string;
        6: string;
        7: string;
        8: string;
        9: string;
    };
};

// 生成混合色 (混黑+混白)
function genMixColor(base: string | RGB | HSL): MixColor{
    // 基准色统一转为 RGB
    if (typeof base === "string") {
        base = hex2rgb(base);
    } else if ("h" in base) {
        base = hsl2rgb(base);
    }

    function mixColor(rgb: RGB, mixColor: RGB,  ratio: number): RGB {
        const mix = (color: number, mixColor: number, ratio: number) => color * (1 - ratio) + mixColor * ratio;
        return {
            r: mix(rgb.r, mixColor.r, ratio),
            g: mix(rgb.g, mixColor.g, ratio),
            b: mix(rgb.b, mixColor.b, ratio),
        };
    }
    
    return {
        DEFAULT: rgb2hex(base),
        dark: {
            1: rgb2hex(mixColor(base, rgbBlack, 0.1)),
            2: rgb2hex(mixColor(base, rgbBlack, 0.2)),
            3: rgb2hex(mixColor(base, rgbBlack, 0.3)),
            4: rgb2hex(mixColor(base, rgbBlack, 0.4)),
            5: rgb2hex(mixColor(base, rgbBlack, 0.5)),
            6: rgb2hex(mixColor(base, rgbBlack, 0.6)),
            7: rgb2hex(mixColor(base, rgbBlack, 0.7)),
            8: rgb2hex(mixColor(base, rgbBlack, 0.78)),
            9: rgb2hex(mixColor(base, rgbBlack, 0.85)),
        },
        light: {
            1: rgb2hex(mixColor(base, rgbWhite, 0.1)),
            2: rgb2hex(mixColor(base, rgbWhite, 0.2)),
            3: rgb2hex(mixColor(base, rgbWhite, 0.3)),
            4: rgb2hex(mixColor(base, rgbWhite, 0.4)),
            5: rgb2hex(mixColor(base, rgbWhite, 0.5)),
            6: rgb2hex(mixColor(base, rgbWhite, 0.6)),
            7: rgb2hex(mixColor(base, rgbWhite, 0.7)),
            8: rgb2hex(mixColor(base, rgbWhite, 0.78)),
            9: rgb2hex(mixColor(base, rgbWhite, 0.85)),
        },
    };
}

export {
    // RGB,
    // HSL,
    // HSV,
    // HEX,

    rgb2hsl,
    hsl2rgb,
    hex2rgb,
    rgb2hex,
    hsl2hex,
    hex2hsl,
    genMixColor,
};
