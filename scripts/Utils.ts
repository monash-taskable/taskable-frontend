/**
 * Tests if a value is of type T, where type T is some literal type
 * 
 * Example:
 * 
 * ```typescript
 * const food = ["Apple", "Banana", "Carrot"] as const;
 * type Food = typeof food[number];
 * 
 * const isFood = isOfType(food);
 * 
 * console.log(isFood("Apple")); // true
 * console.log(isFood("Google")); // false
 * ```
 * 
 * @param typeDef the list consisting all literal value for T
 * @returns A function that checks whether a value belongs to T
 */
export const isOfType = <T>(typeDef: readonly T[]) => (val: any): val is T => typeDef.includes(val);