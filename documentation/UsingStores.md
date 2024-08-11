Using Pinia to manage stores in this project
==

To create a store, create a file under the `stores/` directory.
In the file, paste the following code:

```typescript
import { defineStore } from 'pinia'

export const use_________Store = defineStore({
  id: '_________Store',
  state: () => ({ }),
  actions: {}
})
```

Add some state and actions, and getter if needed.

When using stores in a component, call `use_________Store` function directly.
To make it reactive, use `storeToRefs`, pass in the store object as the first argument to convert the store to a ref, then use it in the component.
Update store values through functions defined in the `actions` field of the store as an interface.

For example:

```vue
<script lang="ts" setup>
// note that you don't need to import the store function and `storeToRefs` function.
const myStore = storeToRefs(useMyStore());
</script>
```

When typing a store object, you can type the return value of the `state()` method when defining a store using `defineStore()`. For example:

```typescript
type StateType = { /*...*/ }

export const useMyStore = defineStore({
  id: "myStore",
  state: (): StateType => ({ /*...*/ }),
  // ...
});
```
