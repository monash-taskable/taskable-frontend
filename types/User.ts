import type { Optional } from "./Optional";

export class User {
  id: number;
  name: string;
  email: string;
  image: Optional<string>;

  constructor (id: number, name: string, email: string, image?: string){
    this.id = id;
    this.name = name;
    this.email = email;
    this.image = image;
  }
};