const { Pregunta, Encuesta, Respuesta, OpcionRespuesta } = require('../models');
const { dbCriptografia } = require('../database/config');

// POST /respuestas - Responder pregunta
const crearRespuesta = async (req, res) => {
  try {
    const { idUsuario } = req.user;
    const { data } = req.body;
    console.log(data);
    if (!idUsuario) {
      return res.status(400).json({ error: 'Falta idUsuario' });
    }
    if (!data) {
      return res.status(400).json({ error: 'Falta la información o no es un arreglo' });
    }
    const respuestasArray = data;
    const transaction = await dbCriptografia.transaction();
    try {
      const fechaRespuesta = new Date();

      for (const respuesta of respuestasArray) {
        const { idOpcionRespuesta, idPregunta } = respuesta;

        if (!idOpcionRespuesta || !idPregunta) {
          await transaction.rollback();
          return res.status(400).json({ error: 'Cada respuesta debe tener idOpcionRespuesta e idPregunta' });
        }

        await Respuesta.create({
          idUsuario,
          idPregunta,
          idOpcionRespuesta,
          fechaRespuesta
        }, { transaction });

      }

      await transaction.commit();

      res.json({ 
        mensaje: 'Respuestas registradas exitosamente',
      });
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

// POST /respuestas/obtener-encuesta - Obtener encuesta con todas las respuestas
const obtenerEncuesta = async (req, res) => {
  try {
    const encuestas = await Encuesta.findAll({
      include: [
        {
          model: Pregunta,
          include: [
            {
              model: OpcionRespuesta,
              attributes: ['idOpcionRespuesta', 'opcion']
            }
          ]
        }
      ]
    });
    
    if (!encuestas || encuestas.length === 0) {
      return res.status(404).json({ error: 'No se encontraron encuestas' });
    }

    // Procesar cada encuesta para agregar el conteo de respuestas
    const encuestasConConteo = await Promise.all(
      encuestas.map(async (encuesta) => {
        const preguntasConConteo = await Promise.all(
          encuesta.Pregunta.map(async (pregunta) => {
            const opcionesConConteo = await Promise.all(
              pregunta.OpcionRespuesta.map(async (opcion) => {
                // Contar cuántas respuestas hay para esta opción
                const count = await Respuesta.count({
                  where: {
                    idOpcionRespuesta: opcion.idOpcionRespuesta,
                    idPregunta: pregunta.idPregunta
                  }
                });

                return {
                  opcion: opcion.opcion,
                  numero: count
                };
              })
            );

            return {
              texto: pregunta.texto,
              opciones: opcionesConConteo
            };
          })
        );

        return {
          nombre: encuesta.nombre,
          preguntas: preguntasConConteo
        };
      })
    );

    res.json({
      encuestas: encuestasConConteo
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /respuestas/obtener-pregunta - Obtener pregunta con sus respuestas
const obtenerPregunta = async (req, res) => {
  try {
    const { idPregunta } = req.body;

    if (!idPregunta) {
      return res.status(400).json({ error: 'Falta idPregunta' });
    }

    const pregunta = await Pregunta.findByPk(idPregunta, {
      include: [
        {
          model: Respuesta,
          attributes: ['idRespuesta', 'idUsuario', 'respuesta', 'fechaRespuesta']
        }
      ]
    });
    
    if (!pregunta) {
      return res.status(404).json({ error: 'Pregunta no encontrada' });
    }

    res.json({ pregunta });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  crearRespuesta,
  obtenerEncuesta,
  obtenerPregunta
};