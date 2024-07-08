import { Table, Column, Model, ForeignKey, DataType } from 'sequelize-typescript';
import { Cards } from './cards.model';
import { Users } from '../users/users.model';

@Table
export class CardsToUser extends Model<CardsToUser> {
    @ForeignKey(() => Users)
    @Column({ type: DataType.STRING })
    user_id: string;

    @ForeignKey(() => Cards)
    @Column({ type: DataType.STRING })
    cards_id: string;
}