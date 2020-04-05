import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Event from "./event.entities";
import Subcription from "./subcription.entities";

@Entity()
class User {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column()
  public oid: string;

  @Column()
  public token: string;

  @Column()
  public email: string;

  @Column({nullable: true})
  public timeMin: string;

  @OneToMany((type) => Event, (event) => event.user)
  public events: Event[];

  @OneToMany((type) => Subcription, (subcription) => subcription.user)
  public subcriptions: Subcription[];
}

export default User;
