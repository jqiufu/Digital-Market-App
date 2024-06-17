import { webpackBundler } from '@payloadcms/bundler-webpack';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { slateEditor } from '@payloadcms/richtext-slate';
import dotenv from 'dotenv';
import path from 'path';
import { buildConfig } from 'payload/config';
import { Media } from './collections/Media';
import { ProductFiles } from './collections/ProductFiles';
import { Products } from './collections/Products/Products';
import { Users } from './collections/Users';
import { Orders } from './collections/Orders';

dotenv.config({
  path: path.resolve(__dirname, '..//env')
});

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || '',
  collections: [Users, Products, Media, ProductFiles, Orders],
  routes: {
    admin: '/sell'
  },
  admin: {
    user: 'users',
    bundler: webpackBundler(),
    meta: {
      titleSuffix: '- DigMark',
      favicon: '/favicon.ico',
      ogImage: '/logo.png'
    }
  },
  rateLimit: {
    max: 2000
  },
  editor: slateEditor({}),
  db: mongooseAdapter({
    url: process.env.MONGODB_URL!
  }),
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts')
  }
});
