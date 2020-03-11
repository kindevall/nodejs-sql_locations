const mysql = require('mysql')
const config = require('./databases/config')
const readlineSync = require('readline-sync')

const connection = mysql.createConnection(config)

/**
 * Function for adding locations.
 */
const addLocation = () => {
  let lat
  let lon

  do {
    lat = Number(readlineSync.question('Latitude [-90 - 90]: '))
  } while (lat < -90 || lat > 90)
  do {
    lon = Number(readlineSync.question('Longitude [-180 - 180]: '))
  } while (lon < -180 || lon > 180)

  const sql = `INSERT INTO locations (lat, lon) VALUES (
  ${connection.escape(lat)}, ${connection.escape(lon)}
  )`

  connection.query(sql, function (error) {
    if (error) throw error
    selectOperation()
  })
}

/**
 * Function for deleting Locations.
 */
const deleteLocation = () => {
  const id = Number(readlineSync.question('Location to delete [ID]: '))
  const sql = `DELETE FROM locations WHERE id = ${connection.escape(id)}`

  connection.query(sql, (err, location) => {
    if (err) {
      throw err
    }
    console.log('Location deleted.')
    selectOperation()
  })
}

/**
 * Function for showing a single location.
 * Determined by user.
 */
const showLocationSingle = () => {
  const id = Number(readlineSync.question('Location to show [ID]: '))
  const sql = `SELECT * FROM locations WHERE id = ${connection.escape(id)}`

  connection.query(sql, (err, location) => {
    if (err) {
      throw err
    }
    console.log(location)
    selectOperation()
  })
}

/**
 * Function for showing all locations.
 */
const showLocationAll = () => {
  connection.query('SELECT * FROM locations', (err, locations) => {
    if (err) {
      throw err
    }
    locations.forEach(location => console.log(location))
    selectOperation()
  })
}

/**
 * The main function of the program which is always returned to.
 * The user selects which operation to perform, via readlineSync.keyInSelect options.
 *
 * Runs until CANCEL (0) is selected.
 * Connection is closed after no user defiend operation is selected (1-4).
 */
const selectOperation = () => {
  const locationHandling = [
    'Add Location',
    'Delete Location',
    'Show Location by ID',
    'Show All Locations'
  ]
  let operation = ''
  operation = readlineSync.keyInSelect(
    locationHandling,
    'What do you want to do?:'
  )
  switch (locationHandling[operation]) {
    case 'Add Location':
      addLocation()
      break
    case 'Delete Location':
      deleteLocation()
      break
    case 'Show Location by ID':
      showLocationSingle()
      break
    case 'Show All Locations':
      showLocationAll()
      break

    default:
      connection.end()
  }
}

selectOperation()
