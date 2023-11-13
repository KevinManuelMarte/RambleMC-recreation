import mysql2 from 'mysql2';
import bcrypt from 'bcryptjs';

const TablaReportes = import.meta.env.SECRET_BD_REPORTES_TABLA


console.log("EL NOMBRE DEL USUARIO ES: " + import.meta.env.SECRET_BD_REPORTES_USER)
console.log("LA CONTRASEÑA ES: " + import.meta.env.SECRET_BD_REPORTES_PASSWORD)
console.log("LA BD ES: " + import.meta.env.SECRET_BD_REPORTES_BD)
console.log("LA TABLA ES: " + import.meta.env.SECRET_BD_REPORTES_TABLA)


const con = mysql2.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: import.meta.env.SECRET_BD_REPORTES_USER, // ramblem1_kevin
    password: import.meta.env.SECRET_BD_REPORTES_PASSWORD, // W=^$.YsPW)nl
    database: import.meta.env.SECRET_BD_REPORTES_BD, // ramblem1_reportes
})

export class Password {
    async HashPasword (password:any) {
        let salt = await bcrypt.genSalt(10);

        const promise = new Promise ((resolve, reject)=> {
            bcrypt.hash(password, salt, (error, hash) => {
                if (error) return reject(error);
                if (hash) return resolve(hash);
            })
        })

        return promise
    }

    async ComparePassword (password:any, hashword:any) {
        const promise = new Promise((resolve, reject) => {
            bcrypt.compare(password, hashword, (error, passwordMatch)=> {
                if (error) return reject("¡Ha ocurrido un error al comparar las contraseñas!" + error);
                if (passwordMatch) resolve(true);
                if (!passwordMatch) resolve(false);
            })
        })

        return promise;
    }
}


export default class Database {
    async agregarReporte (reportado:any | string, reportador:any | string, linksPruebas:any | string, fecha:any | string, motivo:any | string) {
        con.connect((error)=> {
            if (error) return console.log("¡Fallo al conectarse! \n" + error)
        })
        con.query(`INSERT INTO ${TablaReportes} (reportador, reportado, linkPruebas, fecha, motivo) VALUES("${reportador}", "${reportado}", "${linksPruebas}", "${fecha}", "${motivo}")`, (error) => {
            if (error) console.log(error);
            console.log("¡Reporte agregado exitosamente!")
        })
    }

    async conseguirReportes () {
        con.connect((error)=> {
            if (error) return console.log("¡Fallo al conectarse! \n" + error)
        })


        const Reportes =  new Promise((resolve, reject) => {
            con.query(`SELECT * FROM ${TablaReportes}`, (error, results) => {
                if (error) throw reject("¡Ha ocurrido un error al intentar recoger los reportes de la BD! \n" + error);
                resolve(results)
            })
        })

        return Reportes.then((result:any) => result);
    }


    async conseguirUsuario (usuario:any) {
        con.connect((error)=> {
            if (error) return console.log("¡Fallo al conectarse! \n" + error)
        })

        const Reportes =  new Promise((resolve, reject) => {
            con.query(`SELECT * FROM ramblem1_usuarios WHERE usuario = "${usuario}"`, (error, results:any) => {
                if (error) throw reject("¡Ha ocurrido un error al intentar conseguir el usuario de la BD! \n" + error);
                if (results.length == 0) {
                    resolve (false)
                }
                else {
                    resolve (true)
                }
            })
        })


        return Reportes.then((result) => result);
    }

    async iniciarSesion (usuario:any, password:any) {
        const PasswordManager = new Password;
        console.log("AQUI ESTA EL ERROR")
        con.connect((error)=> {
            if (error) return console.log("¡Fallo al conectarse! \n" + error)
        })

        console.log("NO, AQUI")
        console.log(password)
        console.log(usuario)
        const Reportes =  new Promise((resolve, reject) => {
            con.query(`SELECT * FROM ramblem1_usuarios WHERE usuario = "${usuario}"`, (error, results:any) => {
                if (error) throw reject("¡Fallo al intentar iniciar sesión! \n" + error);
                console.log("NO, AQUI X2")
                const PasswordMatch =  PasswordManager.ComparePassword(password, results[0].pass)
                console.log("CHICO WEON")
                PasswordMatch.then(result => resolve(result))
                console.log("AHHHH")
            })
        })


        return Reportes.then((result) => result);
    }


    async EliminarReportes (reportes:any[] | string[]) {
        con.connect((error)=> {
            if (error) return console.log("¡Fallo al conectarse! \n" + error)
        })

        reportes.forEach((reporteID:any)=> {
            con.query(`DELETE FROM ramblem1_reportesUsuarios WHERE reporte_id = ${reporteID}`, (error) => {
                if (error) throw console.log("¡Ha ocurrido un error al intentar eliminar los reportes! \n" + error);
            })
        })
    }

    async AceptarReportes (reportes:any[] | string[]) {
        con.connect((error)=> {
            if (error) return console.log("¡Fallo al conectarse! \n" + error)
        })

        reportes.forEach((reporteID:any)=> {
            con.query(`UPDATE ramblem1_reportesUsuarios SET aceptado = 1, rechazado = 0 WHERE reporte_id = ${reporteID}`, (error) => {
                if (error) throw error;
            })
        })
    }

    async RechazarReportes (reportes:any[] | string[]) {
        con.connect((error)=> {
            if (error) return console.log("¡Fallo al conectarse! \n" + error)
        })

        reportes.forEach((reporteID:any)=> {
            con.query(`UPDATE ramblem1_reportesUsuarios SET aceptado = 0, rechazado = 1 WHERE reporte_id = ${reporteID}`, (error) => {
                if (error) throw error;
            })
        })
    }

}