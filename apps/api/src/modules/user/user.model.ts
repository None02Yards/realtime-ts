// // src/modules/user/user.model.ts (temporary or final)
// import { Schema, model } from 'mongoose';

// const userSchema = new Schema({
//   name:        { type: String, required: true, trim: true, minlength: 2, maxlength: 60 },
//   email:       { type: String, required: true, unique: true, lowercase: true, index: true },
//   passwordHash:{ type: String, required: true },
//   avatarUrl:   { type: String },
//   lastSeenAt:  { type: Date, default: Date.now },
// }, { timestamps: true });

// userSchema.index({ email: 1 }, { unique: true });

// export const User = model('User', userSchema);

import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 60 },
  email: { type: String, required: true, lowercase: true, unique: true, index: true }, // <-- keep only this
  passwordHash: { type: String, required: true },
  avatarUrl: { type: String },
  lastSeenAt: { type: Date, default: Date.now },
}, { timestamps: true });


// userSchema.index({ email: 1 }, { unique: true });

export const User = model('User', userSchema);
