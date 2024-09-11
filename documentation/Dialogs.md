Dialogs
===

Dialogs are movable models/forms/popups, whatever you call it. It has with a title, an list of action button and a body.


### Dialog and `useDialogs()`

Global control over the dialogs currently displaying is provided by `useDialogs()`.

A dialog is defined by an object with type `Dialog<T>` where `T` is the payload type, and the currently visible dialogs on screen is stored under `useDialogs().dialogs`, an object that maps a dialog id to its corresponding dialog object.

Each visible dialog has a id that uniquely identifies it. It is stored under the `id` attribute of the dialog object. When creating a dialog, the id is automatically generated for you. The `id` is associated to that specific dialog until the dialog is closed (by methods like `useDialogs().close()`).

Here are a list of methods of `useDialogs()` you can use:

| method                                                                   | description                                                                                                                                                 | returns                                         |
|--------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------|
| `openDialog<T>(dialog: DialogInit<T>, closable?: boolean)`               | Creates and opens a dialog. When `closable` is `false`, the close button will not be shown. See [Opening and Closing Dialogs](#opening-and-closing-dialogs) | The generated dialog ID in `string`             |
| `getDialog(id: string)`                                                  | Looks up the dialog object with the specified ID                                                                                                            | The dialog object, or `undefined` if not found. |
| `updateDialog<T>(id: string, dialog: DialogInit<T>)`                     | Updates the dialog object with the new object                                                                                                               | `void`                                          |
| `closeDialog(id: string)`                                                | Closes the dialog with the specified ID                                                                                                                     | `void`                                          |
| `closeAllWithType(dialogType: DialogType)`                               | Closes all the dialog with the specified type                                                                                                               | `void`                                          |
| `closeAllWithTypeThenOpen<T>(dialog: DialogInit<T>, closable?: boolean)` | Closes all dialog with the same specified type, then opens a new dialog with the type                                                                       | `void`                                          |
| `closeAllDialogs()`                                                      | Closes all dialog visible                                                                                                                                   | `void`                                          |


### Opening and Closing Dialogs

The first step to opening a dialog, is to define an `DialogInit<T>` object. Depends on your [dialog type](#dialog-types), you may need to adjust the payload type `T` to suite the need of that specific dialog.

Here's an example alert dialog:

```ts
const myAlert: DialogInit<string> = {
  title: "My Alert",
  titleI18n: false,
  dialogType: 'alert',
  payload: "Hello World!",
  width: "300px",
}
```

We can then open that dialog and allow them to be shown on screen by

```ts
const dialogs = useDialogs();

const myAlertId = dialogs.open(myAlert);
const myAlertDialog = dialogs.getDialog(myAlertId);
```

### `Dialog` Object vs `DialogInit` Objects

`DialogInit<T>` consists a subset of the attributes of `Dialog<T>`. 

When creating/opening a dialog, it's common that we don't want to specify all the attributes, and let the controller to use fallback values for essential attributes, thus we use `DialogInit<T>` to only specify the subset of the values specifically want.

Once the dialog is opened using and visible on screen, the `Dialog<T>` object associated to that dialog can be retrieved by `useDialogs().getDialog()`.

### `Dialog` and `DialogInit` Object References

| Property       | Type             | Dialog   | DialogInit | Description                                                                                                             |
| -------------- | ---------------- | -------- | ---------- | ----------------------------------------------------------------------------------------------------------------------- |
| `id`           | `string`         | Required | N/A        | The dialog ID.                                                                                                          |
| `icon`         | `string`         | Optional | Optional   | The icon is shown to the left of the title bar. No icon will be shown if undefined.                                     |
| `titleI18n`    | `boolean`        | Required | Optional   | Specifies if the title is a localisation key. Fallbacks to `true` when undefined.                                       |
| `title`        | `string`         | Required | Required   | The title text or localisation key.                                                                                     |
| `dialogType`   | `DialogType`     | Required | Required   | The type of dialog. See [Dialog Types](#dialog-types).                                                                  |
| `width`        | `string`         | Required | Required   | The width of the window. Can be any value used in `width` property in CSS.                                              |
| `height`       | `string`         | Required | Optional   | The width of the window. Can be any value used in `height` property in CSS. Fallbacks to `max-content` when undefined.  |
| `x`            | `number`         | Optional | Optional   | The left position of the dialog. Centres the dialog and makes it unmovable when undefined.                              |
| `y`            | `number`         | Optional | Optional   | The top position of the dialog. Centres the dialog and makes it unmovable when undefined.                               |
| `actionsLeft`  | `DialogAction[]` | Required | Optional   | List of action buttons left to the close button. Fallbacks to empty list when undefined.                                |
| `actionsRight` | `DialogAction[]` | Required | Optional   | List of action buttons Right to the close button. Fallbacks to empty list when undefined.                               |
| `close`        | `DialogAction`   | Required | Optional   | The close button of the dialog. Fallbacks to `defaultClose`(the default close button) when undefined.                   |
| `style`        | `DialogAction`   | Optional | Optional   | Options to override the default dialog styles.                                                                          |


Where `DialogAction` is an object with the following fields:

| Property      | Type                                 | Required | Description                                                                                                                                                                                                       |
| ------------- | ------------------------------------ | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `caption`     | `string`                             | Required | The caption label of the button.                                                                                                                                                                                  |
| `captionI18n` | `boolean`                            | Required | Specifies if the caption is a localisation key.                                                                                                                                                                   |
| `style`       | `ButtonStyle`                        | Required | The style of the button.                                                                                                                                                                                          |
| `icon`        | `string`                             | Required | The icon of the button.                                                                                                                                                                                           |
| `expanding`   | `boolean`                            | Required | Use the expanding mode on the button. When `true`, the label is hidden until the user interacts with it.                                                                                                          |
| `action`      | `(ctx: Dialog<any>, e: any) => void` | Optional | The function to be called when the button is pressed. `ctx` is the dialog object the button is registered on and `e` is the emitted event, which is different from dialog type. See [Dialog Types](#dialog-types) |

### Dialog Types

There are a few dialog types:

| Type          | Description                                      | View Definition   | Payload | Emits                    | Quick Constructor |
| ------------- | ------------------------------------------------ | ----------------- | ------- | ------------------------ | ----------------- |
| `alert`       | An alert box that shows string messages          | `Alert.vue`       | string  |                          | `quickAlert()`    |
| `createClass` | A box that prompts for a class name, description | `CreateClass.vue` |         | string (for class names) | N/A               |
| `error`       | An alert box that shows error messages           | `Error.vue`       | string  |                          | `quickError()`    |