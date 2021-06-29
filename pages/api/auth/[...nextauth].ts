import { NextApiHandler } from 'next'
import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import Adapters from 'next-auth/adapters'
import prisma from '../../../lib/prisma'

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options)
export default authHandler

const options = {
    providers: [
        Providers.Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        //　プロバイダーは何個でも指定できる。
        // https://next-auth.js.org/getting-started/introduction で一覧がみれる
        // 例：
        // Providers.Twitter({
        //   clientId: process.env.TWITTER_CLIENT_ID,
        //   clientSecret: process.env.TWITTER_CLIENT_SECRET,
        // }),
    ],
    adapter: Adapters.Prisma.Adapter({ prisma }),
    secret: process.env.SECRET,
    callbacks: {
        session: async (session, user) => {
            // user はデータベースに保存されている user オブジェクト
            session.user.id = user.id;
            session.user.name = user.name;
            session.image = user.image;
            return Promise.resolve(session);
        },
    },
};
