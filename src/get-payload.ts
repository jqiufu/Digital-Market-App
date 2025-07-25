import dotenv from 'dotenv';
import path from 'path';
import payload, { Payload } from 'payload';
import type { InitOptions } from 'payload/config';
import nodemailer from 'nodemailer';

dotenv.config({
  path: path.resolve(__dirname, '../.env')
});

const transporter = nodemailer.createTransport({
  host: 'smtp.resend.com',
  secure: true,
  port: 465,
  auth: {
    user: 'resend',
    pass: process.env.RESEND_API_KEY
  }
});

const email = {
  fromName: 'DigMark',
  fromAddress: process.env.RESEND_FROM_EMAIL || '',
  transport: transporter
};

let cached = (global as any).payload;

if (!cached) {
  cached = (global as any).payload = {
    client: null,
    promise: null
  };
}

interface Args {
  initOptions?: Partial<InitOptions>;
}

export const getPayloadClient = async ({
  initOptions
}: Args = {}): Promise<Payload> => {
  if (!process.env.PAYLOAD_SECRET) {
    throw new Error('PAYLOAD_SECRET is missing');
  }

  if (cached.client) {
    return cached.client;
  }

  if (!cached.promise) {
    cached.promise = payload.init({
      email,
      secret: process.env.PAYLOAD_SECRET,
      local: initOptions?.express ? false : true,
      ...(initOptions || {})
    });
  }

  try {
    cached.client = await cached.promise;
  } catch (e: unknown) {
    cached.promise = null;
    throw e;
  }

  return cached.client;
};
