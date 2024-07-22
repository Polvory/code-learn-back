import { Model, Table, Column, DataType, BelongsToMany } from "sequelize-typescript";
import { DataTypes } from 'sequelize'
import { Cards } from "../questions/cards.model";
import { CardsToUser } from "../questions/CardsToUser.model";

interface UsersCreationAttrs {
    id: string;
    user_id: string | number;
    user_name?: string;
    user_image: string
    banned: boolean;
    reqvests: number;
    premium: boolean;
    subscription_date: string;
}
const add_Date = () => {
    let currentDate = new Date();
    let futureDate = new Date();
    return futureDate.setDate(currentDate.getDate() + 7);
}



@Table({ tableName: 'users' })
export class Users extends Model<Users, UsersCreationAttrs> {

    @Column({ type: DataTypes.STRING, defaultValue: DataTypes.UUIDV4, allowNull: false, primaryKey: true })
    id: string;

    @Column({ type: DataType.STRING, unique: true })
    user_id: string | number;

    @Column({ type: DataType.TEXT })
    user_name: string;

    @Column({ type: DataType.STRING })
    user_image: string;


    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    banned: boolean;

    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    premium: boolean;

    @Column({ type: DataType.INTEGER, defaultValue: 20 })
    reqvests: number;

    @BelongsToMany(() => Cards, () => CardsToUser)
    cards: Cards[];

    @Column({ type: DataType.STRING, defaultValue: add_Date() })
    subscription_date: string;
}
