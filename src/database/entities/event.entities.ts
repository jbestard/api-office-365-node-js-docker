import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import User from "./user.entities";

@Entity()
class Event {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column()
  public eatg: string;

  @Column()
  public eventId: string;

  @Column()
  public status: string;

  @Column()
  public htmlLink: string;

  @Column()
  public created: string;

  @Column()
  public updated: string;

  @Column()
  public summary: string;

  @Column()
  public creatorEmail: string;

  @Column()
  public creatorSelf: boolean;

  @Column()
  public organizerEmail: string;

  @Column()
  public organizerSelf: boolean;

  @Column()
  public startDateTime: string;

  @Column()
  public startTimeZone: string;

  @Column()
  public endDateTime: string;

  @Column()
  public endTimeZone: string;

  @Column()
  public icaluid: string;

  @Column()
  public isReminderOn: boolean;

  @Column()
  public reminderMinutesBeforeStart: number;

  @ManyToOne((type) => User, (user) => user.events)
  public user: User;
}

export default Event;
