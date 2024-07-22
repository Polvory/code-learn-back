import { Model, Table, Column, DataType, BelongsToMany } from "sequelize-typescript";
import { DataTypes } from 'sequelize'
import { Users } from "../users/users.model";
import { CardsToUser } from "./CardsToUser.model";
import { CardsToQw } from "./CardsToQw.model";
import { DataQw } from "./dataQw.model";

interface cardsreationAttrs {
    type: string;
    description: string;
    img_url: string;
}

@Table({ tableName: 'cards' })
export class Cards extends Model<Cards, cardsreationAttrs> {

    @Column({ type: DataTypes.STRING, defaultValue: DataTypes.UUIDV4, allowNull: false, primaryKey: true })
    id: string;

    @Column({ type: DataType.STRING, unique: true })
    type: string;

    @Column({ type: DataType.TEXT })
    description: string;

    @Column({ type: DataType.STRING })
    img_url: string;

    @BelongsToMany(() => Users, () => CardsToUser)
    users: Users[];

    @BelongsToMany(() => DataQw, () => CardsToQw)
    questions: DataQw[];
}