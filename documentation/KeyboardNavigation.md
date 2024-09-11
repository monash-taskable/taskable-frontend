KeyboardSupport
==

### Element Outlining

When navigating the page with a keyboard, the active element (selected element such as buttons, input box) is highlighted in blue.

To assign focus effect in an element, include `defmix-focusable` mixin (defined in [`DefaultStyles.scss`](/assets/styles/constants/DefaultStyles.scss)). Any element included the mixin will be outlined with blue when class `focused` is present.

The outline style is defined in [`DefaultStyles.scss`](/assets/styles/constants/DefaultStyles.scss) as `$def-tabsel-outline`.

You can also override the outline value with a custom one for a specific element by overriding the first optional parameter when including the mixin.

### Tab Indices

We want to take the case of browsing without a pointing device (either mouse or touch screen) into account, to be specific, when only using keyboard. When tabbing through the webpage using keyboard, a logical and instinct order of elements to be selected should be designed. When implementing this design, the `tabindex` attribute of each HTML element (and some custom defined component that supports this attribute as a prop) can be used to decide which one to select first.

When there are indefinite amount of item in a specific element to focus, they can share the same index and let the browser decide their order.

Here are some rules and guidelines to indexing these elements.

| Element Description                         | Tab Index Range (Inclusive) |
|---------------------------------------------|-----------------------------|
| Unfocusable elements                        | -1                          |
| "Skip to content" button                    | 5                           |
| Popups, Dropdowns and Models [(1)](#note-1) | 100 ~ 199                   |
| Header bar                                  | 200 ~ 299                   |
| Sidebar (Project Navigation)                | 300 ~ 399                   |
| Page Content (Top right to bottom left)     | 600 ~ 799                   |
| Footer                                      | 800 ~ 899                   |

##### note (1): 

Note that if a popup, dropdown or model is shown because of an interaction of an element, it should take an index that is a direct successor of the element. E.g. a popup is shown by pressing enter on a button with an index of 610, then the elements in the popup should start from 611 or above, below the next available index.

### The "Skip to Content" Button

The "Skip to Content" button should take the highest priority `5` of all tab indices, and it should skip the focus to the lowest tab index larger or equals to 600.

However, the button is optional, and should be used only when it is required depending on the content of the page.