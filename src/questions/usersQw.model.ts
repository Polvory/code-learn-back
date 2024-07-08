import { Model, Table, Column, DataType } from "sequelize-typescript";
import { DataTypes } from 'sequelize'


export interface dataUserQwCreationAttrs {
    user_id: string;
    type: string;
    question: string;
    hint: string;
    result?: boolean
}

@Table({ tableName: 'usersQw' })
export class UsersQw extends Model<UsersQw, dataUserQwCreationAttrs> {
    @Column({ type: DataTypes.STRING, defaultValue: DataTypes.UUIDV4, allowNull: false, primaryKey: true })
    id: string;

    @Column({ type: DataType.STRING })
    user_id: string;

    @Column({ type: DataType.STRING })
    type: string;

    @Column({ type: DataType.TEXT })
    question: string;

    @Column({ type: DataType.TEXT })
    hint: string


    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    result: boolean;
}
