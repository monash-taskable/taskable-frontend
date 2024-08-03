Theming and Related Assets Management
==

### Style Files and Global Styles

The `@/assets/styles/Main.scss` file is loaded globally (as configured in `@/nuxt.config.ts`).
Any style files imported (by `@use` or `@import` statements in `Main.scss`) is also loaded globally together.

When importing, the imports (`@use` and `@import` statements) should be on the top of the `Main.scss` file for readability.

The global style files are categorised based on the nature of their code.

* `Main.scss` the main entry point of global stylesheet.
* `StyleDefinitions.scss` defines constant variable tokens, as well as other generic style constants such as spacing, typography and screen-sizes.
* `FontDefinitions.scss` is used when local font file is used (See [Fonts](#fonts)).


Define global constant immutable [scss variables](https://sass-lang.com/documentation/variables/) can be done in `Main.scss` (although it's recommended to have a separate file to do so, while importing that file in `Main.scss`). These variables are replaced to it's literal values when building, which means it cannot be updated during runtime.

Theme related variables needs to be defined in vanilla css variable (`:root{ --var: value; }`). Thought it's constant, it has to be changed during runtime (i.e. Theme Switching), thus instead of [scss variables](https://sass-lang.com/documentation/variables/) syntax `$varname`, the builtin `var(--varname)` should be used when referencing these variables.

### Colours and Themes

Colours are the accent colours a user can choose, no matter what themes they're on. E.g. They can have dark theme with green accent, blue accent or orange accent.

Themes are the "Dark/Light/Contrast" mode of the application.

Currently, the themes are:

| Theme Name          | Code Name        | Class Tag               |
| ------------------- | ---------------- | ----------------------- |
| Light Mode          | `light`          | `theme--light`          |
| Dark Mode           | `dark`           | `theme--dark`           |
| Contrast Light Mode | `contrast-light` | `theme--contrast-light` |

### Adding a Theme and Colour

When adding a new theme, decide a code name, its class tag will be the code name prefixed with `theme--`.

First, add the theme's code name to `@/types/Theming.ts` (also note the theme down in the table above ideally in the same commit).

Then, add a section in `@/assets/styles/StyleDefinitions.scss`, with a selector of `&.<class tag>` under the `#theme-provider, .theme-override` selector. For example, a section for Light mode (i.e. class tag of `theme--light`) may look like this:

```scss
// @/assets/styles/StyleDefinitions.scss
#theme-provider,
.theme-override{

  &.theme--light{
    /* Some variable definitions here */
  
    &.color--blue{ /* accent colour definitions goes here */}
    &.color--green{ /* accent colour definitions goes here */ }
    /* ... other colours */
  }

}
```

Adding a colour option will be as simple as adding a colour section in each theme section.

See [Token Table](#token-table) for a list of token to be defined in each section.

### Token Table

In the theme section (outside of colour sections), define the following variables:

| Variable Name                   | Description                                                                                                                                                                        |
|---------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `background`                    | The background colour for the lowest layer                                                                                                                                         |
| `background-interaction-strong` | The interaction colour when layer colour does not contrast enough                                                                                                                  |
| `layer-background`              | The background colour for the top layer containers (e.g. cards)                                                                                                                    |
| `foreground`                    | The default foreground colour (mostly used in texts)                                                                                                                               |
| `foreground-weak`               | The secondary foreground colour, with a lower visual strangth.                                                                                                                     |
| `foreground-disabled`           | The foreground colour with the lowest strangth, to denote disabled or placeholder UI elements                                                                                      |
| `dangerous-strong`              | Functional colour denotes dangerous elements with the highest contrast with background, usually used as foreground                                                                 |
| `dangerous-intermediate`        | Functional colour denotes dangerous elements with intermediate contrast with background. Can be used flexibly                                                                      |
| `dangerous-interact`            | Functional colour dneotes dangerous elements thats one level more intense than `dangerous-weak`, usually as a visual feedback as the interaction of dangerous elements' background |
| `dangerous-interact`            | Functional colour denotes dangerous elements with the lowest contrast with background, usually used as background                                                                  |

As you probably noticed, that for each theme, all colour modes' definitions should also be defined.
In each colour mode, define the following variables: 
| Variable Name         | Description                                                                                                                                                                   |
|-----------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `accent-strong`       | Functional colour denotes accented elements with the highest contrast with background, usually used as foreground                                                             |
| `accent-intermediate` | Functional colour denotes accented elements with intermediate contrast with background. Can be used flexibly                                                                  |
| `accent-interact`     | Functional colour dneotes accented elements thats one level more intense than `accent-weak`, usually as a visual feedback as the interaction of accented elements' background |
| `accent-interact`     | Functional colour denotes accented elements with the lowest contrast with background, usually used as background                                                              |

### Fonts

Google Fonts and local fonts:

* If a font is available via Google Fonts, it is directly imported to `@/assets/styles/FontDefinitions.scss`, no local file is needed.
* If a font is not available via Google Fonts, font file should be stored locally in `@/assets/fonts/`, with its definitions stored in `@/assets/styles/FontDefinitions.scss`.

Fonts used in this project are:

* IBM Plex Sans
* IBM Plex Mono

To improve performance, only import or define font weights and styles that is required, don't import every available weight and style.

### Colour and Variable Tokens

Tokens are pre-defined constants or variables to the `:root` tag or `<... id='theme-provider'>` tag, which contains styles that is being used universally in the application.

Raw tokens are fixed tokens defined to the `:root` tag, that doesn't change as theme changes. Examples are `white`, `gnr-blue20` etc.
Variable tokens are defined to the `<... id='theme-provider'>` tag, where each tag usually is a reference to a raw token. When theme or colour changes, the theme variable tokens will change its reference to a new value, so that the elements using those tags changes its styles as well. Examples are `background`, `foreground`, `accent-strong` etc.

### Class Binding and Theme Sepecific Customisation of Components

the `<... id='theme-provider'>` html tag contains classes that allows browser to choose which set of variables to load.
The theme selected is denoted with the `theme--<name>` class tag and the accent colour selected is denoted with the `color--<name>` class tag.

Usually, when styling a component, just use the predefined variable tokens will do. When theme changes, the referenced value of those token changes as well.

This project provides two aspect of fine tweaking the theme and accent to be used for a specific area, different from the global theme and accent.

#### Override Theme and Accent with another Predefined Theme

When you wish to override the global theme and accent provided by the global provider, you can use a override provider by specifying `theme-override` class along with the `theme--<name>` tag or `color--<name>` tag, or both.

All element wrapped in the `theme-override` element will use the theme and accent specified rather than the global theme.

See the following example:

```vue
<!-- @/components/Example.vue -->

<script lang="ts" setup> /* ... */ </script>

<template>
  <div>
    <button>I am a button with global light theme</button>
    <div class="theme-override theme--dark">
      <button>I am a button with dark theme</button>
    </div>
  </div>
</template>

<style scoped lang="scss">

.predefined {
  // definitions for all themes except contrast-light
  background: var(--accent-weak);
  color: var(--accent-strong);
  border-radius: 0px;
  border: 0px;
}

</style>
```

#### Override Theme and Accent with custom styles

When you need exceptions other than the predefined tokens, you can style the component by selecting a specific class tag with parent selector.

See the following example:

```vue
<!-- @/components/Example.vue -->

<script lang="ts" setup> /* ... */ </script>

<template>
  <div>
    <button>I am a button with pre-defined theme</button>
    <button class="customized">I am a button with customised theme</button>
  </div>
</template>

<style scoped lang="scss">

.predefined {
  // definitions for all themes except contrast-light
  background: var(--accent-weak);
  color: var(--accent-strong);
  border-radius: 0px;
  border: 0px;

  // only contrast-light theme will have solid outlines
  .theme--contrast-light & {
    border: 1px solid var(--foreground);
  }
}

</style>
```

