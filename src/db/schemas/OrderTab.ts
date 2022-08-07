import { Schema } from 'mongoose';

export default new Schema({
    opener: { type: Schema.Types.ObjectId, ref: 'User' },
    opened_at: { type: 'date' },
    orders: [{
        for: { type: Schema.Types.ObjectId, ref: 'User' },
        balsam_item_guid: { type: 'string' }
    }]
})