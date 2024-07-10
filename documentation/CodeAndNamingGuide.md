Code and Naming Guide
==

### British English vs American English

In documentation, comments and other natural language explanatory components, both are accepted.
In code, variable naming and code names, american english is preferred for consistency, though not forced.

### File names

Rule of thumb: Use `PascalCase` for all source code and assets files, use `camelCase` for all directories.

For localisation files, see [I18n.md](/documentation/I18n.md).

### Variable Naming

Always use `const` and `let` only, avoid `var` declarations.

Variables are named using `camelCase`, types are named using `PascalCase`. When defining a constructor for a type, the function name should be the same name as the type in `camelCase`. For example:

```typescript
// type definition
type BlogPost {
  title: string,
  content: string
};

// constructor
const blogPost = (title?: string, content?: string): BlogPost => {
  if (title === undefined) title = "";
  if (content === undefined) content = "";

  return { title, content };
};

// or use object as parameter for constructor
const blogPost = (options: {title?: string, content?: string}): BlogPost => {
  if (options.title === undefined) title = "";
  if (options.content === undefined) content = "";

  return { title, content };
}
```

### Line Length

There are no strict limitations on line length, but try to keep it short, for readability.

### Type Definitions

Type definitions should be stored in `@/types/`, where each typescript file should contain type definitions, constructors and any helper function related to its type.

### Workspace Root

The alias symbol for workspace root are `@` and `~`. There are no specific preference for this project.

For example: `@/components/`, `@/assets/styles/Main.scss` etc.

Note that not all programmatic reference of path supports this, some uses absolute path format. For example, the above paths will be referenced like `/components/` or `/assets/styles/Main.scss`.