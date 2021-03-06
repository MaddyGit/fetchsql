const Sequelize = require('sequelize')

const sequelize = new Sequelize('rapiddb', 'rapiddb', 'rapiddb', {
    host : '192.168.56.101'
    , dialect : 'mysql'
})

const getRS = query => sequelize.query(query)
const getRSs = queries => {
    const resultSets = []
    
    return new Promise( (res, rej) => {
        Promise.all(queries.map(query => getRS(query)))
        .then(rss => rss.forEach(rs => resultSets.push(rs[0])))
        .then(_ => res(resultSets))
        .catch(err => {
            console.log(`\nQuery process failed!\n${err}\n\n`)
            rej(err)
        })
    })
}

const getRSWithHeader = query => {
    return new Promise ( (res, rej) => {
        sequelize.query(query.query)
        .then(rs => res({header: query.header, rs: rs[0]}))
        .catch(err => rej(err))
    })
}

const getRSsWithHeaders = async queries => {
    /**
     * queries = [ {header: '', query: ''}, ... ]
     */

    return Promise.all(queries.map(query => getRSWithHeader(query)))
}

module.exports = {
    getRS, getRSs, getRSWithHeader, getRSsWithHeaders
}
