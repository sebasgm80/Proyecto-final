//! --------------------------middleware------------------------------------
const { deleteImgCloudinary } = require("../../middleware/files.middleware");

//! ---------------------------- modelos ----------------------------------
const User = require("../models/User.model");
const Wallet = require("../models/Wallet.model");
const Book = require("../models/Book.model")
const Message = require("../models/Message.model")



//! ---------------------------- utils ----------------------------------
const randomCode = require("../../utils/randomCode");
const sendEmail = require("../../utils/sendEmail");

//! ------------------------------librerias--------------------------------
const nodemailer = require("nodemailer");
const validator = require("validator");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const {
  setTestEmailSend,
  getTestEmailSend,
} = require("../../state/state.data");
const setError = require("../../helpers/handle-error");
const { generateToken } = require("../../utils/token");
const randomPassword = require("../../utils/randomPassword");
const enumOk = require("../../utils/enumOk");
const { mongoose } = require("mongoose");
const logger = require("../../../logger");


dotenv.config();

/**+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 * +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 * +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 */
//! -----------------------------------------------------------------------------
//? ----------------------------REGISTER LARGO EN CODIGO ------------------------
//! -----------------------------------------------------------------------------
//------------------->CRUD es el acrónimo de "Crear, Leer, Actualizar y Borrar"
const register = async (req, res, next) => {
  let catchImg = req.file?.path;

  try {
    await User.syncIndexes();
    const { email } = req.body;

    const userExist = await User.findOne({ email });

    if (!userExist) {
      const newUser = new User({ ...req.body, image: req.file ? req.file.path : "https://pic.onlinewebfonts.com/svg/img_181369.png" });

      try {
        const userSave = await newUser.save();

        // Crear wallet para el nuevo usuario
        const newWallet = new Wallet({
          userId: userSave._id,
          balance: 100  // Cada nueva wallet comienza con 100 BookCoins
        });
        const walletSave = await newWallet.save();

        // Actualizar usuario con el ID de la wallet
        await User.findByIdAndUpdate(userSave._id, { wallet: walletSave._id });

        // Devuelve la respuesta con el usuario y su wallet
        return res.status(200).json({
          user: await User.findById(userSave._id).populate('wallet'),  // Cargar los datos de la wallet
          wallet: walletSave
        });

      } catch (error) {
        if (req.file) deleteImgCloudinary(catchImg);
        return res.status(404).json(error.message);
      }
    } else {
      if (req.file) deleteImgCloudinary(catchImg);
      return res.status(409).json("This user already exists");
    }
  } catch (error) {
    if (req.file) deleteImgCloudinary(catchImg);
    return next(error);
  }
};






//! -----------------------------------------------------------------------------
//? --------------------------------LOGIN ---------------------------------------
//! -----------------------------------------------------------------------------

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userDB = await User.findOne({ email });

    if (userDB) {
      // compara dos contraseñar una sin encryptar y otra que si lo esta
      if (bcrypt.compareSync(password, userDB.password)) {
        const token = generateToken(userDB._id, email);
        return res.status(200).json({
          user: userDB,
          token,
        });
      } else {
        return res.status(404).json("password dont match");
      }
    } else {
      return res.status(404).json("User no register");
    }
  } catch (error) {
    return next(error);
  }
};

//! -----------------------------------------------------------------------------
//? --------------------------------AUTOLOGIN ---------------------------------------
//! -----------------------------------------------------------------------------

const autoLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userDB = await User.findOne({ email });

    if (userDB) {
      // comparo dos contraseñas encriptadas
      if (password == userDB.password) {
        const token = generateToken(userDB._id, email);
        return res.status(200).json({
          user: userDB,
          token,
        });
      } else {
        return res.status(404).json("password dont match");
      }
    } else {
      return res.status(404).json("User no register");
    }
  } catch (error) {
    return next(error);
  }
};

//! -----------------------------------------------------------------------------
//? -----------------------CONTRASEÑAS Y SUS CAMBIOS-----------------------------
//! -----------------------------------------------------------------------------

//? -----------------------------------------------------------------------------
//! ------------------CAMBIO DE CONTRASEÑA CUANDO NO ESTAS LOGADO---------------
//? -----------------------------------------------------------------------------

const changePassword = async (req, res, next) => {
  try {
    /** vamos a recibir  por el body el email y vamos a comprobar que
     * este user existe en la base de datos
     */
    const { email } = req.body;
    console.log(req.body);
    const userDb = await User.findOne({ email });
    if (userDb) {
      /// si existe hacemos el redirect
      const PORT = process.env.PORT;
      return res.redirect(
        307,
        `http://localhost:${PORT}/api/v1/users/sendPassword/${userDb._id}`
      );
    } else {
      return res.status(404).json("User no register");
    }
  } catch (error) {
    return next(error);
  }
};

const sendPassword = async (req, res, next) => {
  try {
    /** VAMOS A BUSCAR AL USER POOR EL ID DEL PARAM */
    const { id } = req.params;
    const userDb = await User.findById(id);
    const email = process.env.EMAIL;
    const password = process.env.PASSWORD;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: email,
        pass: password,
      },
    });
    let passwordSecure = randomPassword();
    console.log(passwordSecure);
    const mailOptions = {
      from: email,
      to: userDb.email,
      subject: "-----",
      text: `User: ${userDb.name}. Your new code login is ${passwordSecure} Hemos enviado esto porque tenemos una solicitud de cambio de contraseña, si no has sido ponte en contacto con nosotros, gracias.`,
    };
    transporter.sendMail(mailOptions, async function (error, info) {
      if (error) {
        /// SI HAY UN ERROR MANDO UN 404
        console.log(error);
        return res.status(404).json("dont send email and dont update user");
      } else {
        // SI NO HAY NINGUN ERROR
        console.log("Email sent: " + info.response);
        ///guardamos esta contraseña en mongo db

        /// 1 ) encriptamos la contraseña
        const newPasswordBcrypt = bcrypt.hashSync(passwordSecure, 10);

        try {
          /** este metodo te lo busca por id y luego modifica las claves que le digas
           * en este caso le decimos que en la parte dde password queremos meter
           * la contraseña hasheada
           */
          await User.findByIdAndUpdate(id, { password: newPasswordBcrypt });

          //!------------------ test --------------------------------------------
          // vuelvo a buscar el user pero ya actualizado
          const userUpdatePassword = await User.findById(id);

          // hago un compare sync ----> comparo una contraseña no encriptada con una encrptada
          /// -----> userUpdatePassword.password ----> encriptada
          /// -----> passwordSecure -----> contraseña no encriptada
          if (bcrypt.compareSync(passwordSecure, userUpdatePassword.password)) {
            // si son iguales quiere decir que el back se ha actualizado correctamente
            return res.status(200).json({
              updateUser: true,
              sendPassword: true,
            });
          } else {
            /** si no son iguales le diremos que hemos enviado el correo pero que no
             * hemos actualizado el user del back en mongo db
             */
            return res.status(404).json({
              updateUser: false,
              sendPassword: true,
            });
          }
        } catch (error) {
          return res.status(404).json(error.message);
        }
      }
    });
  } catch (error) {
    return next(error);
  }
};

//? -----------------------------------------------------------------------------
//! ------------------CAMBIO DE CONTRASEÑA CUANDO YA SE ESTA ESTA LOGADO---------
//? -----------------------------------------------------------------------------

const modifyPassword = async (req, res, next) => {
  /** IMPORTANTE ---> REQ.USER ----> LO CREAR LOS AUTH MIDDLEWARE */
  console.log("req.user", req.user);

  try {
    const { password, newPassword } = req.body;
    const { _id } = req.user;

    /** comparamos la contrasela vieja sin encriptar y la encriptada */
    if (bcrypt.compareSync(password, req.user.password)) {
      /** tenemos que encriptar la contraseña para poder guardarla en el back mongo db */
      const newPasswordHashed = bcrypt.hashSync(newPassword, 10);

      /** vamos a actualizar la contraseña en mongo db */
      try {
        await User.findByIdAndUpdate(_id, { password: newPasswordHashed });

        /** TESTING EN TIEMPO REAL  */

        //1) Traemos el user actualizado
        const userUpdate = await User.findById(_id);

        // 2) vamos a comparar la contraseña sin encriptar y la tenemos en el back que esta encriptada
        if (bcrypt.compareSync(newPassword, userUpdate.password)) {
          /// SI SON IGUALES 200 ---> UPDATE OK
          return res.status(200).json({
            updateUser: true,
          });
        } else {
          ///NO SON IGUALES -------> 404 no son iguales
          return res.status(404).json({
            updateUser: false,
          });
        }
      } catch (error) {
        return res.status(404).json(error.message);
      }
    } else {
      /** si las contraseñas no son iguales le mando un 404 diciendo que las contraseñas no son iguales */
      return res.status(404).json("password dont match");
    }
  } catch (error) {
    return next(error);
    /**
     * return next(
      setError(
        500,
        error.message || 'Error general to ChangePassword with AUTH'
      )
    );
     */
  }
};

//! -----------------------------------------------------------------------------
//? ---------------------------------UPDATE--------------------------------------
//! -----------------------------------------------------------------------------

const update = async (req, res, next) => {
  let catchImg = req.file?.path;

  try {
    await User.syncIndexes();

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Preparar datos para la actualización
    const updateData = {
      ...req.body,
      image: req.file ? catchImg : user.image,
    };

    // Preservar campos que no deben ser cambiados
    updateData._id = user._id;
    updateData.password = user.password;
    updateData.rol = user.rol;
    updateData.confirmationCode = user.confirmationCode;
    updateData.email = user.email;
    updateData.check = user.check;
    updateData.library = user.library;

    if (req.body?.fuel) {
      const resultEnum = enumOk(req.body?.fuel);
      updateData.fuel = resultEnum.check ? req.body?.fuel : user.fuel;
    }

    try {
      const updatedUser = await User.findByIdAndUpdate(req.user._id, { $set: updateData }, { new: true });

      if (req.file) deleteImgCloudinary(user.image);

      // ++++++++++++++++++++++ TEST RUNTIME+++++++++++++++++++++++++++++++++++++++
      const updateKeys = Object.keys(req.body);
      const testUpdate = [];

      updateKeys.forEach((item) => {
        if (updatedUser[item] === req.body[item]) {
          if (updatedUser[item] != req.user[item]) {
            testUpdate.push({ [item]: true });
          } else {
            testUpdate.push({ [item]: "sameOldInfo" });
          }
        } else {
          testUpdate.push({ [item]: false });
        }
      });

      if (req.file) {
        updatedUser.image === catchImg
          ? testUpdate.push({ image: true })
          : testUpdate.push({ image: false });
      }

      return res.status(200).json({ updatedUser, testUpdate });
    } catch (error) {
      if (req.file) deleteImgCloudinary(catchImg);
      return res.status(404).json(error.message);
    }
  } catch (error) {
    if (req.file) deleteImgCloudinary(catchImg);
    return next(error);
  }
};

module.exports = { update };

// #region  delete
//! -----------------------------------------------------------------------------
//? ---------------------------------DELETE--------------------------------------
//! -----------------------------------------------------------------------------

const deleteUser = async (req, res, next) => {
  try {
    const { _id, image } = req.user;

    // Eliminar la wallet asociada
    await Wallet.findOneAndDelete({ userId: _id });

    // Obtener todos los libros del usuario para eliminar las imágenes
    const userBooks = await Book.find({ userId: _id });

    // Eliminar todos los libros asociados
    await Book.deleteMany({ userId: _id });

    // Eliminar los mensajes asociados al usuario
    try {
      const deleteResult = await Message.deleteMany({ $or: [{ buyerId: _id }, { sellerId: _id }] });
      console.log(`Deleted ${deleteResult.deletedCount} messages`);
    } catch (error) {
      console.error('Error deleting messages:', error.message);
      // Continuar, ya que la eliminación de mensajes no es crítica
    }

    // Eliminar las imágenes de los libros del usuario de Cloudinary
    for (const book of userBooks) {
      if (book.image) {
        await deleteImgCloudinary(book.image);
      }
    }

    // Eliminar el usuario
    await User.findByIdAndDelete(_id);

    if (await User.findById(_id)) {
      // Si el usuario no se eliminó
      return res.status(404).json("not deleted");
    } else {
      // Eliminar la imagen del usuario de Cloudinary si es necesario
      if (image) {
        await deleteImgCloudinary(image);
      }

      return res.status(200).json("ok delete");
    }
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  deleteUser,
};



//! -----------------------------------------------------------------------------
//? ---------------------------------FOLLOW USER--------------------------------------
//! -----------------------------------------------------------------------------

const followUserToggle = async (req, res, next) => {
  try {
    const { idUserSeQuiereSeguir } = req.params;
    const { followed } = req.user; // busco en el arrray de seguidores si le sigo o no este usuario

    if (followed.includes(idUserSeQuiereSeguir)) {
      //! si lo incluye, quiere decir lo sigo por lo que lo dejo de seguir
      try {
        // 1) como lo quiero dejar de seguir quito su id del array de los que me siguen

        await User.findByIdAndUpdate(req.user._id, {
          $pull: {
            followed: idUserSeQuiereSeguir,
          },
        });
        try {
          // 2) del user que dejo de seguir me tengo que quitar de sus seguidores

          await User.findByIdAndUpdate(idUserSeQuiereSeguir, {
            $pull: {
              followers: req.user._id,
            },
          });

          return res.status(200).json({
            action: "he dejado de seguirlo",
            authUser: await User.findById(req.user._id),
            userSeQuiereSeguir: await User.findById(idUserSeQuiereSeguir),
          });
        } catch (error) {
          return res.status(404).json({
            error:
              "error catch update quien le sigue al user que recibo por el param",
            message: error.message,
          });
        }
      } catch (error) {
        return res.status(404).json({
          error:
            "error catch update borrar de seguidor el id que recibo por el param",
          message: error.message,
        });
      }
    } else {
      //! si no lo tengo como que lo sigo, lo empiezo a seguir

      try {
        // 1) como lo quiero dejar de seguir quito su id del array de los que me siguen

        await User.findByIdAndUpdate(req.user._id, {
          $push: {
            followed: idUserSeQuiereSeguir,
          },
        });
        try {
          // 2) del user que dejo de seguir me tengo que quitar de sus seguidores

          await User.findByIdAndUpdate(idUserSeQuiereSeguir, {
            $push: {
              followers: req.user._id,
            },
          });

          return res.status(200).json({
            action: "Lo empiezo a seguir de seguirlo",
            authUser: await User.findById(req.user._id),
            userSeQuiereSeguir: await User.findById(idUserSeQuiereSeguir),
          });
        } catch (error) {
          return res.status(404).json({
            error:
              "error catch update quien le sigue al user que recibo por el param",
            message: error.message,
          });
        }
      } catch (error) {
        return res.status(404).json({
          error:
            "error catch update poner de seguidor el id que recibo por el param",
          message: error.message,
        });
      }
    }
  } catch (error) {
    return res.status(404).json({
      error: "error catch general",
      message: error.message,
    });
  }
};

const getUsersWithBooks = async (req, res) => {
  try {
      const users = await User.find()
          .select('nick email name')
          .populate({
              path: 'library',
              select: 'title'
          });

      const usersWithBookCounts = users.map(user => {
          const userObj = user.toObject();
          userObj.bookCount = user.library.length;
          return userObj;
      });

      return res.status(200).json(usersWithBookCounts);
  } catch (error) {
      console.error("Error al obtener los usuarios:", error);
      return res.status(500).json({ message: "Error al obtener los usuarios", error: error.message });
  }
};




module.exports = {
  register,
  login,
  autoLogin,
  changePassword,
  sendPassword,
  modifyPassword,
  update,
  deleteUser,
  followUserToggle,
  getUsersWithBooks,
};
