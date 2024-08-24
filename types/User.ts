import type { Optional } from "./Optional";
import type { User as UserProto } from "./proto/User";

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

  static fromProto(user: UserProto){
    return new User(user.id, user.username, user.email);
  }
};