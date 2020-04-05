import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import User from "./user.entities";

@Entity()
class Subcription {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column()
  public SubId: string;

  @Column()
  public resourceId: string;

  @Column()
  public resourceUrl: string;

  @Column()
  public expiration: string;

  @ManyToOne((type) => User, (user) => user.subcriptions)
  public user: User;
}

export default Subcription;
