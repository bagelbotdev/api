import { Schema } from "mongoose";

export default new Schema({
    host: { type: 'string' },
    last_online: { type: 'number' }
});

export interface HostSpec {
    host: string,
    last_online: string
}