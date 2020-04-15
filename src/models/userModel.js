const mongoose = require('mongoose')
const validator = require('validator')
const bycript = require('bcryptjs')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        set: val => val.replace(/ /g, ""),
        validate(value) {
            let result = isNaN(parseInt(value))

            if (!result) {
                throw new Error("Username tidak boleh angka")
            }
        }
    },
    name: {
        type: String,
        required: true,
        trim: true, // Menghapuse spasi sebelum dan sesudah data input , " randy orton " -> "randy orton"
        validate(value) { // Handle jika yang di input user bukan sebuah string

            let result = isNaN(parseInt(value))

            if (!result) {
                throw new Error("Username tidak boleh angka")
            }

        }

    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true, // Akan mengubah data menjadi huruf kecil semua
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email tidak valid")
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7
    },
    age: {
        type: Number,
        default: 0,
        set: val => parseInt(val)
    }
})

// bycript enkripsi password
userSchema.pre('save', async function(next) {
    let user = this // isi this adalah isi object user yang ada di index

    try {
        user.password = await bycript.hash(user.password, 8)
    } catch (err) {
        throw new Error('Masalah saat hash password')
    }

    next()
})


const User = mongoose.model('User', userSchema)

module.exports = User