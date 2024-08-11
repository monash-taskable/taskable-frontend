export type InputStyle = {
  colorPreset?: InputPreset,
  backgroundColor?: String,
  backgroundColorInteract?: String,
  foregroundColor?: String,
  foregroundColorInteract?: String,
  placeholderColor?: String,
  iconColor?: String,
  iconColorInteract?: String,
  padding?: String,
  width?: String,
  height?: String,
  size?: InputSize,
};


export type InputSize = 
  | "large"
  | "medium"
  | "small";


export type InputPreset =
  | "background"
  | "layer"
  | "error"


export const presets: ReadonlyMap<InputPreset, InputStyle> = new Map([
  ["background", {
    backgroundColor: "var(--background)",
    backgroundColorInteract: "var(--background)",
    foregroundColor: "var(--foreground)",
    placeholderColor: "var(--dangerous-strong)",
  }],
  ["layer", {
    backgroundColor: "var(--layer-background)",
    backgroundColorInteract: "var(--layer-background)",
  }],
  ["error", {
    foregroundColor: "var(--dangerous-strong)",
    placeholderColor: "var(--dangerous-strong)",
  }]
]);


/**
 * This function takes a base input style, and returns a new 
 * input style with all the fields filled.
 * 
 * When using presets, pass in a style with only presets set, and the returned the style
 * will contain all the needed fields required by a input tuned to the preset selected.
 * 
 * @param style The base input style
 * @returns The filled input style
 */
export const inputStyle = (style: InputStyle): InputStyle => {
  const { colorPreset } = style;

  let fallback = <InputStyle> presets.get("background");

  let preset: InputStyle = {};
  if (colorPreset !== undefined && presets.has(colorPreset)){
    preset = <InputStyle> presets.get(colorPreset);
  }

  else{
    preset = <InputStyle> presets.get("background");
  }

  // style takes higher priority than preset.
  return { ...fallback, ...preset, ...style }
};