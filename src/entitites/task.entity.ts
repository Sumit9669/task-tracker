import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
@Entity({ name: "user_task" })
export class Task {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  taskName: string;

  @Column()
  taskDetail: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column()
  status: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
