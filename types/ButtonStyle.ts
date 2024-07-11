export type ButtonStyle = {
  colorPreset?: ColorPreset,
  backgroundColor?: String,
  backgroundColorHover?: String,
  foregroundColor?: String,
  foregroundColorHover?: String,
  padding?: String,
  focusable?: boolean,
  size?: ButtonSize,
};

export type ButtonSize = 
  | "large" 
  | "medium" 
  | "small";

export type ColorPreset = 
  | "background" 
  | "layer" 
  | "strong" 
  | "accent" 
  | "accent-strong" 
  | "dangerous";


export const presets: ReadonlyMap<ColorPreset, ButtonStyle> = new Map([
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