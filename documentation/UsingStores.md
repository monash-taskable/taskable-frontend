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
