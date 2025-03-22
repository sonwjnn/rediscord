// import * as schema from '@/db/schema'
// import { neon } from '@neondatabase/serverless'
// import 'dotenv/config'
// import { drizzle } from 'drizzle-orm/neon-http'
// import { v4 as uuidv4 } from 'uuid'

// const sql = neon(process.env.DATABASE_URL!)
// const db = drizzle(sql, { schema })

const main = async () => {
  try {
    console.log('Seeding database...')

    // const userId = '4073b79d-2c78-4d67-9124-f8e1e60770d5'

    console.log('Seeding completed successfully')
  } catch (error) {
    console.error(error)
    throw new Error('Failed to seed database')
  }
}

main()