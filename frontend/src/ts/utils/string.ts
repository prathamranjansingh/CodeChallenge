export function kebabToCamel(str: string): string {
    let result = "";
    let toUpper = false;

    for (let char of str) {
        if (char === "-") {
            toUpper = true; 
        } else {
            result += toUpper ? char.toUpperCase() : char;
            toUpper = false; 
        }
    }

    return result;
}


export function changeCase( str: string, 
    changeTo:  
        | "camel"
        | "pascal"
        | "snake"
        | "kebab"
        | "scream"
        | "upper"
        | "lower"
    ){
        if (str == null) return;
    switch (changeTo) {
        case "camel":
        case "pascal":
            return toCamelOrPascalCase(str, changeTo);
        case "snake":
        case "kebab":
        case "scream":
            return toSnakeOrKebabOrScreamCase(str, changeTo);
        case "upper":
        case "lower":
            return toUpperOrLowerCase(str, changeTo);
        default:
            throw new Error(`Invalid case: ${changeTo}`);
    }
}


export function toCamelOrPascalCase(str: string, changeTo: "camel" | "pascal") {
    let result = str
        .split(/[-_ ]+/)
        .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join("");
    return changeTo === "camel"
        ? result.charAt(0).toLowerCase() + result.slice(1)
        : result;
}

export function toUpperOrLowerCase(str: string, changeTo: "lower" | "upper") {
    let result = str.replace(/[-_ ]+/g, "");
    return changeTo === "upper" ? result.toUpperCase() : result.toLowerCase();
}

export function toSnakeOrKebabOrScreamCase(
    str: string,
    changeTo: "snake" | "kebab" | "scream"
) {
    let separator = changeTo === "kebab" ? "-" : "_";
    let result = str.split(/[-_ ]+/).join(separator);
    if (changeTo === "scream") {
        result = result.toUpperCase();
    }
    return result.toLocaleLowerCase();
}

export function rmCharAt(str: string, index: number): string {
    return str.slice(0, index) + str.slice(index + 1);
}

export function spice(
    string: string,
    start: number,
    deleteCount: number,
    insertString?: string
): string {
    return (
        string.slice(0, start) + 
        (insertString || "") +
        string.slice(start+(deleteCount || 0))
    )
}

export function addCharAt(
    str: string,
    strToAdd: string,
    index: number
): string {
    return str.slice(0, index) + strToAdd + str.slice(index);
}


export function tolowercase(str: string): string {
    if (str === " ") return " ";
    if (str == null) return " ";
    return str.toLowerCase();
}

export function kebabToSpacedPascal(str: string) {
    if (str == null) return "";
    let spliced = str.split("-");
    let upperCasedFirstChars = spliced.map((str) => {
        return spice(str, 0, 1, str[0].toUpperCase());
    });
    return upperCasedFirstChars.join(" ");
}