const tableDate = "date";
const tableTime = "settime";
const tableObject = "object";
const tablePrice = "price";
const numEl = 20;

function insertArr() {
    for (var i = numEl, arr = []; i >= 0; i--) {
        let date = new Date(new Date().setDate(new Date().getDate() - i));
        let dateISO = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split("T")[0];
        arr.push(dateISO);
    }
    let arrData = arr.map((item) => {
        return `INSERT INTO ${tableDate} (date) SELECT '${item}' WHERE NOT EXISTS (SELECT 1 FROM ${tableDate} WHERE date = '${item}')`;
    });
    return arrData.join(";");
}

export async function initializeDatabase(db) {
    try {
        await db.execAsync(`
                
            PRAGMA journal_mode = WAL;
          BEGIN TRANSACTION;
            CREATE TABLE IF NOT EXISTS ${tableDate} (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                id_parents INTEGER,
                date date
             );
            CREATE TABLE IF NOT EXISTS ${tableTime} (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                year INT,
                month STRING,
                days INT
            );
             CREATE TABLE IF NOT EXISTS ${tablePrice} (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                time FLOAT,
                overtime FLOAT,
                weekend FLOAT
            );
             CREATE TABLE IF NOT EXISTS ${tableObject} (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                id_parents INTEGER,
                object TEXT,
                time INT,
                time1 DATETIME,
                time2 DATETIME
            );
                ${insertArr()};
          COMMIT TRANSACTION;
        `);
        const allRows = await db.getAllAsync(`SELECT id FROM ${tableDate}`);
        for (const row of allRows) {
            await db.runAsync(
                `INSERT INTO ${tableObject} (id_parents) SELECT ${row.id} WHERE NOT EXISTS (SELECT 1 FROM ${tableObject} WHERE id_parents = ${row.id})`
            );
        }

        await db.runAsync(
            `INSERT INTO ${tablePrice} (time, overtime, weekend) SELECT 20, 27, 31 WHERE NOT EXISTS (SELECT 1 FROM ${tablePrice} WHERE id = 1 )`
        );

        const year = new Date().toLocaleString("ru", { year: "numeric" });
        //const year = 2024;
        const month = ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"];
        let days = Array(12).fill(0); //
        days = year == 2024 ? [22, 21, 21, 21, 20, 20, 23, 21, 21, 23, 19, 20].map((i) => i * 8) : days;
        days = year == 2025 ? [21, 20, 21, 21, 21, 20, 23, 20, 22, 23, 19, 21].map((i) => i * 8) : days;

        for (let i = 0; i < month.length; i++) {
            await db.runAsync(
                `INSERT INTO ${tableTime} (year,month, days) SELECT ${year}, '${month[i]}',${days[i]} WHERE NOT EXISTS (SELECT 1 FROM ${tableTime} WHERE year = ${year} AND month = '${month[i]}')`
            );
        }

        console.log("Database  initialised");
    } catch (error) {
        console.log("Error while initializing database : ", error);
    }
}
