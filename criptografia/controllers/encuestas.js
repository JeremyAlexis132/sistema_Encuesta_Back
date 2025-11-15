const { Encuesta, Usuario, Pregunta, OpcionRespuesta, EncuestaAsignada, Respuesta } = require('../models');
const { dbCriptografia } = require('../database/config');
const { Op } = require('sequelize');

// POST /encuestas/crear - Crear encuesta (solo admin)
const crear = async (req, res) => {
  try {
    if (req.user.tipo !== 'admin') {
      return res.status(403).json({ error: 'Solo administradores pueden crear encuestas' });
    }

    // Accept either { encuesta: { nombre, preguntas } } or { nombre, preguntas }
    const payload = req.body.encuesta || req.body;
    const { nombre, preguntas } = payload;

    if (!nombre || !Array.isArray(preguntas)) {
      return res.status(400).json({ error: 'Falta nombre o preguntas debe ser un arreglo' });
    }

    // Usar transacción para asegurar consistencia
    const transaction = await dbCriptografia.transaction();
    try {
      const nuevaEncuesta = await Encuesta.create({ nombre }, { transaction });

      const preguntasCreadas = [];
      for (const p of preguntas) {
        const texto = p.texto || p.textoPregunta || null;
        const respuestas = p.respuestas || p.opciones || [];

        if (!texto) {
          await transaction.rollback();
          return res.status(400).json({ error: 'Cada pregunta debe tener el campo texto' });
        }

        const nuevaPregunta = await Pregunta.create({ idEncuesta: nuevaEncuesta.idEncuesta, texto }, { transaction });

        const opcionesCreadas = [];
        if (Array.isArray(respuestas)) {
          for (const opcionValor of respuestas) {
            const opcionStr = (typeof opcionValor === 'object' && opcionValor.opcion) ? opcionValor.opcion : opcionValor;
            const nuevaOpcion = await OpcionRespuesta.create({ idPregunta: nuevaPregunta.idPregunta, opcion: opcionStr }, { transaction });
            opcionesCreadas.push(nuevaOpcion.get({ plain: true }));
          }
        }

        preguntasCreadas.push({ pregunta: nuevaPregunta.get({ plain: true }), opciones: opcionesCreadas });
      }

      await transaction.commit();

      res.status(201).json({
        mensaje: 'Encuesta creada',
        encuesta: nuevaEncuesta.get({ plain: true }),
        preguntas: preguntasCreadas
      });
    } catch (err) {
      await transaction.rollback();
      throw err;
    }

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /encuestas/agregar-pregunta - Agregar pregunta (solo admin)
const agregarPregunta = async (req, res) => {
  try {
    if (req.user.tipo !== 'admin') {
      return res.status(403).json({ error: 'Solo administradores pueden crear preguntas' });
    }

    const { idEncuesta, pregunta } = req.body;

    if (!idEncuesta || !pregunta) {
      return res.status(400).json({ error: 'Falta idEncuesta o pregunta' });
    }

    const encuesta = await Encuesta.findByPk(idEncuesta);
    if (!encuesta) {
      return res.status(404).json({ error: 'Encuesta no encontrada' });
    }

    const nuevaPregunta = await Pregunta.create({ idEncuesta, pregunta });

    res.status(201).json({
      mensaje: 'Pregunta añadida',
      pregunta: { idPregunta: nuevaPregunta.idPregunta, idEncuesta, pregunta }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// GET /encuestas - Obtener todas las encuestas
const obtenerEncuestas = async (req, res) => {
  try {
    const encuestas = await Encuesta.findAll({
      include: [
        { model: Pregunta },
        { 
          model: EncuestaAsignada,
          attributes: ['idUsuario']
        }
      ]
    });

    res.json({ encuestas });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /encuestas/obtener - Obtener encuesta específica
const obtenerEncuesta = async (req, res) => {
  try {
    const { idEncuesta } = req.body;

    if (!idEncuesta) {
      return res.status(400).json({ error: 'Falta idEncuesta' });
    }

    const encuesta = await Encuesta.findByPk(idEncuesta, {
      include: [{ model: Pregunta }]
    });
    
    if (!encuesta) {
      return res.status(404).json({ error: 'Encuesta no encontrada' });
    }

    res.json({ encuesta });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const asignarEncuesta = async (req, res) => {
  const { idUsuario, idEncuesta } = req.body;

  if (!idUsuario || !idEncuesta) {
    return res.status(400).json({ error: 'Falta idUsuario o idEncuesta' });
  }
  try {

    const usuario = await Usuario.findByPk(idUsuario);
    const encuesta = await Encuesta.findByPk(idEncuesta);

    if (!usuario || !encuesta) {
      return res.status(404).json({ error: 'Usuario o Encuesta no encontrados' });
    }
    await EncuestaAsignada.create({ idUsuario, idEncuesta });

    res.status(201).json({
      mensaje: 'Encuesta asignada al usuario exitosamente'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const obtenerEncuestaAsignada = async (req, res) => {
  const { idUsuario } = req.user;
  if (!idUsuario) {
    return res.status(400).json({ error: 'Falta idUsuario' });
  }
  try {
    const encuestasAsignadas = await EncuestaAsignada.findAll({
      where: { idUsuario },
      include: [
        { 
          model: Encuesta,
          include: [
            {
              model: Pregunta,
              include: [
                {
                  model: OpcionRespuesta
                }
              ]
            }
          ]
        }
      ]
    });

    // Verificar si el usuario ya contestó alguna pregunta de cada encuesta
    const encuestasConEstado = await Promise.all(
      encuestasAsignadas.map(async (encuestaAsignada) => {
        const encuesta = encuestaAsignada.Encuestum;
        let contestada = false;

        if (encuesta && encuesta.Pregunta && encuesta.Pregunta.length > 0) {
          // Obtener IDs de todas las preguntas de esta encuesta
          const idsPreguntas = encuesta.Pregunta.map(p => p.idPregunta);

          // Verificar si existe al menos una respuesta del usuario para alguna pregunta
          const respuestaExistente = await Respuesta.findOne({
            where: {
              idUsuario,
              idPregunta: { [Op.in]: idsPreguntas }
            }
          });

          contestada = !!respuestaExistente;
        }

        return {
          ...encuestaAsignada.get({ plain: true }),
          contestada
        };
      })
    );

    res.json({ encuestasAsignadas: encuestasConEstado });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  crear,
  agregarPregunta,
  obtenerEncuestas,
  obtenerEncuesta,
  asignarEncuesta,
  obtenerEncuestaAsignada
};
