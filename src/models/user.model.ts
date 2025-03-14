import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';

const Schema = mongoose.Schema;

interface UserAttrs {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  authToken: string;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

export interface UserDoc extends mongoose.Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  correctPassword: any;
  accountNumber: string;
  accountBalance: number;
  authToken: string;
}

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Your First-Name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Your Last-Name is required'],
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: [true, 'Email is required'],
      validate: [validator.isEmail, 'Invalid email'],
    },
    accountNumber: {
      type: String,
      default: null,
      unique: true,
    },
    accountBalance: {
      type: Number,
      default: 0,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      default: null,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: 'user',
      enum: ['user', 'admin'],
    },
    password: {
      type: String,
      default: null,
      required: [true, 'Password is required'],
      minlength: 4,
      select: false,
    },
    authToken: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
      select: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    passwordChangedAt: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
    collection: 'Users',
  },
);

const generateAccountNumber = (): string => {
  const min = 1000000000; // Minimum 10-digit number
  const max = 9999999999; // Maximum 10-digit number
  return Math.floor(Math.random() * (max - min + 1) + min).toString();
};

userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Generate account number only when a new user is created (this.isNew is true)
  if (this.isNew) {
    let accountNumber: string = '';
    let isAccountNumberUnique = false;

    while (!isAccountNumberUnique) {
      accountNumber = generateAccountNumber();
      // Check if the generated account number already exists in the database.
      const existingUser = await User.findOne({ accountNumber });
      if (!existingUser) {
        isAccountNumberUnique = true;
      }
    }

    this.accountNumber = accountNumber;
  }

  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = `${Date.now() - 1000}`;
  next();
});

userSchema.methods.correctPassword = async function (candidatePassword: string, userPassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('Users', userSchema);

export { User };
