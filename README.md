# Objetivo:
Desarrollar una API en GraphQL que gestione un sistema de reservas para un consultorio médico.

# Colecciones:
    Pacientes: Contiene la información de los pacientes que solicitan una cita.
    Citas: Contiene la información de las citas agendadas, asociadas a un paciente.
# Resolvers:
    addPatient, cuyos parámetros deben ser:
        Nombres y apellidos, tipo: "María Gómez Pérez"
        Número de teléfono incluyendo prefijo nacional, tipo: "+34645543345"
        Correo electrónico, tipo: "maria.gomez@example.com"
    Devuelve el paciente recién creado con su ID.

    addAppointment, cuyos parámetros deben ser:
        ID del paciente (generado por MongoDB).
        Fecha y hora de la cita en formato ISO 8601.
        Tipo de consulta (ej. "Consulta General", "Odontología", "Psicología").
    Devuelve la cita creada con su ID y los datos del paciente asociado.

    getPatient, cuyo parámetro debe ser el ID del paciente y que devuelve:
        Nombres y apellidos.
        Número de teléfono.
        Correo electrónico.
    Lista de citas agendadas con sus fechas y tipos de consulta.

    getAppointments, que devuelve todas las citas registradas con la siguiente información:
        Fecha y hora de la cita.
        Tipo de consulta.
        Nombre del paciente.
        Número de teléfono del paciente.

    deleteAppointment, cuyo parámetro debe ser el ID de la cita y que devuelve true o false en función de si la cita se ha borrado satisfactoriamente o no.

    updatePatient, cuyo parámetro debe ser el ID del paciente y los nuevos datos (nombre, teléfono y/o correo electrónico). Devuelve los datos actualizados del paciente.

# Notas:
Se debe validar que el número de teléfono es correcto utilizando una API externa. Si no es válido, la mutación devolverá un error de GraphQL.
No se permite más de un paciente con el mismo número de teléfono o correo electrónico. Esto debe validarse a través de Mongoose.
Para obtener información de validación del número de teléfono o zona horaria del paciente, se puede usar una API externa como las de API Ninjas.