export type ButtonStyle = {
  colorPreset?: ButtonPreset,
  backgroundColor?: String,
  backgroundColorHover?: String,
  foregroundColor?: String,
  foregroundColorHover?: String,
  padding?: String,
  focusable?: boolean,
  size?: ButtonSize,
};

export type ButtonProps = {
  style?: ButtonStyle,
  label: string,
  labelI18n: boolean,
  expanding?: boolean,
  expanded?: boolean,
  icon: string,
  inputIcon?: string,
}

export type ButtonSize = 
  | "large" 
  | "medium" 
  | "small";

export type ButtonPreset = 
  | "background" 
  | "layer" 
  | "strong" 
  | "accent" 
  | "accent-strong" 
  | "dangerous"
  | "dangerous-strong";


export const presets: ReadonlyMap<ButtonPreset, ButtonStyle> = new Map([
  ["background", {
    backgroundColor: "transparent",
    backgroundColorHover: "var(--background)",
  }],
  ["layer", {
    backgroundColor: "transparent",
    backgroundColorHover: "var(--layer-background)",
  }],
  ["strong", {
    backgroundColor: "transparent",
    backgroundColorHover: "var(--background-interaction-strong)",
  }],
  ["accent", {
    backgroundColor: "transparent",
    backgroundColorHover: "var(--accent-interact)",
    foregroundColor: "var(--accent-strong)",
  }],
  ["accent-strong", {
    backgroundColor: "var(--accent-weak)",
    backgroundColorHover: "var(--accent-interact)",
    foregroundColor: "var(--accent-strong)",
  }],
  ["dangerous", {
    backgroundColor: "transparent",
    backgroundColorHover: "var(--dangerous-weak)",
    foregroundColor: "var(--dangerous-strong)",
  }],
  ["dangerous-strong", {
    backgroundColor: "var(--dangerous-weak)",
    backgroundColorHover: "var(--dangerous-interact)",
    foregroundColor: "var(--dangerous-strong)",
  }],
]);

/**
 * This function takes a base button style, and returns a new 
 * button style with all the fields filled.
 * 
 * When using presets, pass in a style with only presets set, and the returned the style
 * will contain all the needed fields required by a button tuned to the preset selected.
 * 
 * @param style The base button style
 * @returns The filled button style
 */
export const buttonStyle = (style: ButtonStyle): ButtonStyle => {
  const { colorPreset } = style;

  let preset: ButtonStyle = {};
  if (colorPreset !== undefined && presets.has(colorPreset)){
    preset = <ButtonStyle> presets.get(colorPreset);
  }

  else{
    preset = <ButtonStyle> presets.get("background");
  }

  // style takes higher priority than preset.
  return { ...preset, ...style }
};