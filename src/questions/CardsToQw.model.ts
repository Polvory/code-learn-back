import { Table, Column, Model, ForeignKey, DataType } from 'sequelize-typescript';
import { Cards } from './cards.model';
import { DataQw } from './dataQw.model';

@Table
export class CardsToQw extends Model<CardsToQw> {
    @ForeignKey(() => DataQw)
    @Column({ type: DataType.STRING })
    question_id: string;

    @ForeignKey(() => Cards)
    @Column({ type: DataType.STRING })
    cards_id: string;
}