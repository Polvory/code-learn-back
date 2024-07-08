import { Model, Table, Column, BelongsToMany, DataType } from "sequelize-typescript";
import { DataTypes } from 'sequelize'
import { Cards } from "./cards.model";
import { CardsToQw } from "./CardsToQw.model";

export interface dataQwCreationAttrs {
    type: string;
    question: string;
    hint: string;
}

@Table({ tableName: 'dataQw' })
export class DataQw extends Model<DataQw, dataQwCreationAttrs> {

    @Column({ type: DataTypes.STRING, defaultValue: DataTypes.UUIDV4, allowNull: false, primaryKey: true })
    id: string;

    @Column({ type: DataType.STRING })
    type: string;

    @Column({ type: DataType.TEXT, unique: true })
    question: string;

    @Column({ type: DataType.TEXT })
    hint: string

    @BelongsToMany(() => Cards, () => CardsToQw)
    cards: Cards[];
}