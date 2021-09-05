
const { Pool } = require('pg');

function getClient() {
    return  new Pool({
        connectionString:  process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });
}

exports.persistStats = async (payload) => {
    const client = await getClient().connect()
    const insert_text = 'INSERT INTO holders(evangelists_count, strategists_count, evangelists_amount, strategists_amount, price, market_cap, date) VALUES($1, $2, $3, $4, $5, $6, date(now())) RETURNING *;'
    const values = [payload['tiers']['evangelist']['count'], 
                    payload['tiers']['strategist']['count'], 
                    parseInt(payload['tiers']['evangelist']['total']),
                    parseInt(payload['tiers']['strategist']['total']),
                    payload['ebscInfo']['priceNumber'],
                    payload['ebscInfo']['marketcap']]

    try {
        await client.query(insert_text, values)
    } catch (err) {
        if (err.code == '23505') {
            const update_text = 'UPDATE holders SET evangelists_count = $1, strategists_count = $2,evangelists_amount = $3, strategists_amount = $4, price = $5, market_cap = $6 WHERE date = date(now())'
            try {
                await client.query(update_text, values)
            } catch(err_up) {
                console.log('error on persist', err_up)
            }
        }
    }

    client.end()

}

exports.fetchStats = async () => {
    const client = await getClient().connect()
    let rows = []
    try {
        const stats = await client.query('SELECT * FROM holders ORDER BY date DESC LIMIT 30;')
        rows = stats.rows
    } catch(err) {
        console.log('Err', err)
    }
    client.end()

    return rows
}