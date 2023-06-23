export function capitalize(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

type ColorTheme = "dark" | "light";
export function getColorTheme(): ColorTheme {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return "dark";
    }

    return "light";
}

/**
 * Returns white if the theme is dark, and black if the theme is light
 */
export function getPrimaryThemeColor(): string {
    switch (getColorTheme()) {
        case "dark": return "white";
        case "light": return "black";
    }
}

/**
 * Returns the background-gray if the theme is dark, and white if the theme is light
 */
export function getBackgroundThemeColor(): string {
    switch(getColorTheme()) {
        case "dark": return "var(--background-gray)";
        case "light": return "white";
    }
}