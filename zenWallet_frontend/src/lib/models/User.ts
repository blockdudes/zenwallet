import mongoose, { Schema, Document } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

export enum CALLBACK_TYPE {
    LEND,
    BORROW,
    REPAY,
    SWAP
}

interface ISaveAaveData extends Document {
    userAddress: string;
    amount: number;
    tokenAddress: string;
    callbackType: CALLBACK_TYPE;
}

interface IUser extends Document {
    walletAddress: string;
    telegramChatId: string;
    aaveData?: ISaveAaveData[];
}

const SaveAaveDataSchema = new Schema({
    userAddress: { type: String, required: true },
    amount: { type: Number, required: true },
    tokenAddress: { type: String, required: true },
    callbackType: { type: String, enum: Object.values(CALLBACK_TYPE), required: true },
});

const UserSchema: Schema<IUser> = new Schema({
    walletAddress: { type: String, required: true ,unique: true, lowercase: true},
    telegramChatId: { type: String, required: true },
    aaveData: { type: [SaveAaveDataSchema], default: [] },
}, { timestamps: true });

UserSchema.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.' });

UserSchema.index({ email: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export const Aave = mongoose.models.Aave || mongoose.model('Aave', SaveAaveDataSchema);

export type { IUser, ISaveAaveData };
